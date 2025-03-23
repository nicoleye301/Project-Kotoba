package com.example.server.service;

import com.example.server.entity.ChatGroup;
import com.example.server.entity.Friendship;
import com.example.server.entity.GroupMember;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.ChatGroupMapper;
import com.example.server.mapper.FriendshipMapper;
import com.example.server.mapper.GroupMemberMapper;
import com.example.server.mapper.UserMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;

@Service
public class UserService {

    @Resource
    private UserMapper userMapper;

    @Value("${upload-directory}")
    private String uploadBaseDir;   //configured in applications.yml

    private final GroupMemberMapper groupMemberMapper;
    private final FriendshipMapper friendshipMapper;
    private final MessageService messageService;

    @Autowired
    public UserService(GroupMemberMapper groupMemberMapper, FriendshipMapper friendshipMapper, MessageService messageService) {
        this.groupMemberMapper = groupMemberMapper;
        this.friendshipMapper = friendshipMapper;
        this.messageService = messageService;
    }

    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new CustomException(500, "Username not found");
        }
        if (!Objects.equals(password, user.getPassword())) {
            throw new CustomException(500, "Wrong password");
        }
        return user;
    }

    public void register(User user) {
        // using default avatar
        if (user.getAvatar() == null) {
            user.setAvatar("default.png");
        }
        userMapper.add(user);
    }

    public User getUserById(Integer id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new CustomException(404, "User not found");
        }
        return user;
    }

    public List<User> searchUsers(String username) {
        return userMapper.searchByUsername(username);
    }

    public void updateSettings(String userId, String settings) {
        userMapper.updateSettings(Integer.valueOf(userId), settings);
    }

    public void uploadFile(String userId, MultipartFile file, Path path) {
        try {
            //save to local directory
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            //update url on database
            userMapper.updateAvatar(Integer.valueOf(userId), path.getFileName().toString());
        } catch (IOException e) {
            System.err.println(e);
            throw new CustomException(500, "File IO error when saving file on server");
        }

    }

    public void setPassword(String userId, String password) {
        userMapper.setPassword(Integer.valueOf(userId), password);
    }

    public List<Map<String, Object>> getChatStreaks(String userId){
        List<Map<String, Object>> result = new LinkedList<>();
        // get all chats with user ID
        Integer userIdInteger = Integer.valueOf(userId);
        List<Integer> groups = groupMemberMapper.selectGroupIdsByUserId(userIdInteger);
        // order by streak length
        groups.sort((p1, p2) ->
                messageService.getLongestChatDates(p2, userIdInteger)-
                messageService.getLongestChatDates(p1, userIdInteger));
        // take 5 chats with the longest streaks
        for(int i=0;i<Math.min(5, groups.size());i++){  // maybe less than 5 chats
            Map<String, Object> item = new HashMap<>();
            Integer group = groups.get(i);
            item.put("groupName", group);   //need to fetch group name
            item.put("streak", messageService.getLongestChatDates(group, userIdInteger));
            result.add(item);
        }
        return result;
    }

    public Map<String, Object> getMilestones(String userId){
        Integer userIdInteger = Integer.valueOf(userId);
        List<Friendship> friendships = friendshipMapper.selectFriendshipsByUser(userIdInteger);
        Map<String, Object> result = new HashMap<>();
        for(Friendship friendship:friendships){
            Integer friendIdInteger = friendship.getFriendId();
            int friendShipId = friendship.getId();
            String friendName = userMapper.selectById(friendIdInteger).getUsername();
            String milestoneSettings = friendship.getMilestoneSettings();
            int chatGroupId =  friendship.getDirectChatGroupId();

            // parse milestone settings json
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode;
            try {
                jsonNode = objectMapper.readTree(milestoneSettings);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            long timestamp = jsonNode.get("startTime").asLong();
            int period = jsonNode.get("period").asInt();
            int repeat = jsonNode.get("repeat").asInt();
            int progress = jsonNode.get("progress").asInt();
            if (repeat==progress){
                progress=0; // reset last full cycle
            }
            LocalDate startDate = Instant.ofEpochSecond(timestamp)
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
            LocalDate now = LocalDateTime.now().toLocalDate();
            LocalDate thisPeriodStart = startDate.plusDays((long) (progress) * period);
            LocalDate thisPeriodEnd = startDate.plusDays((long) (progress+1) * period);

            // conclude the result
            Map<String, Object> item = new HashMap<>();
            item.put("friendName", friendName);
            if(now.isAfter(thisPeriodEnd)){
                // this period has passed
                boolean achieved = messageService.checkMilestone(chatGroupId, userIdInteger, thisPeriodStart, thisPeriodEnd);
                item.put("updated", true);
                item.put("congrats", achieved);
                if(achieved){
                    progress++;
                }
                else{
                    startDate = thisPeriodEnd;
                    progress = 0;
                }
                // form a new json and update in database
                Map<String, Object> milestoneSettingUpdate = new HashMap<>();
                milestoneSettingUpdate.put("startTime", Timestamp.valueOf(startDate.atStartOfDay()));
                milestoneSettingUpdate.put("period", period);
                milestoneSettingUpdate.put("repeat", repeat);
                milestoneSettingUpdate.put("progress", progress);
                try {
                    milestoneSettings = objectMapper.writeValueAsString(milestoneSettingUpdate);
                    friendshipMapper.updateMilestoneSettings(friendShipId, milestoneSettings);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }
            else{
                // still inside this period
                // recover the progress if previously reset
                progress = jsonNode.get("progress").asInt();
                item.put("updated", false);
            }
            item.put("progress", progress); // achieved a full cycle
            item.put("period", period);
            result.put(String.valueOf(friendIdInteger), item);
        }
        return result;
    }
}

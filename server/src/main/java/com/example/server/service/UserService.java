package com.example.server.service;

import com.example.server.entity.ChatGroup;
import com.example.server.entity.GroupMember;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.ChatGroupMapper;
import com.example.server.mapper.GroupMemberMapper;
import com.example.server.mapper.UserMapper;
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
import java.util.*;

@Service
public class UserService {

    @Resource
    private UserMapper userMapper;

    @Value("${upload-directory}")
    private String uploadBaseDir;   //configured in applications.yml

    private final GroupMemberMapper groupMemberMapper;
    private final MessageService messageService;

    @Autowired
    public UserService(GroupMemberMapper groupMemberMapper, MessageService messageService) {
        this.groupMemberMapper = groupMemberMapper;
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
}

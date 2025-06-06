package com.example.server.service;

import com.example.server.entity.GroupMember;
import com.example.server.entity.Message;
import com.example.server.exception.CustomException;
import com.example.server.mapper.MessageMapper;
import com.example.server.websocket.KTextWebSocket;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;

@Service
public class MessageService {

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private KTextWebSocket kTextWebSocket;

    @Resource
    private GroupMemberService groupMemberService;

    @Value("${upload-directory}")
    private String uploadBaseDir;


    // get chat history for the given direct_chat_group_id
    public List<Message> getMessagesByGroupId(Integer groupId) {
        return messageMapper.selectMessagesByGroupId(groupId);
    }

    // send a new message: store in DB, then broadcast via WebSocket
    public Message sendMessage(Integer senderId, Integer groupId, String content, String type) {
        try {
            Message msg = new Message();
            msg.setContent(content);
            msg.setSenderId(senderId);
            msg.setGroupId(groupId);
            msg.setType(type);
            msg.setSentTime(LocalDateTime.now());
            msg.setStatus("sent");

            // insert into DB
            messageMapper.insertMessage(msg);

            // broadcast to WebSocket clients
            HashMap<String, Object> data = new HashMap<>();
            data.put("id", msg.getId());
            data.put("senderId", msg.getSenderId());
            data.put("groupId", msg.getGroupId());
            data.put("content", msg.getContent());
            data.put("timestamp", msg.getSentTime().toString());
            data.put("type", msg.getType());
            ObjectMapper objectMapper = new ObjectMapper();

            // get group members
            List<GroupMember> groupMembers = groupMemberService.getMembers(msg.getGroupId());
            kTextWebSocket.broadcast(objectMapper.writeValueAsString(data), groupMembers);

            return msg;
        } catch (Exception e) {
            throw new CustomException(500, "Error sending message: " + e.getMessage());
        }
    }

    public boolean checkMilestone(Integer groupId, Integer userId, LocalDate start, LocalDate end){
        List<Message> messages = messageMapper.selectMessagesByGroupIdDesc(groupId);
        for (Message message : messages) {
            // only messages that the user sent is counted
            if (message.getSenderId().equals(userId)){
                LocalDate date = message.getSentTime().toLocalDate();
                if(!(date.isBefore(start) || date.isAfter(end))){
                    return true;
                }
            }
        }
        return false;
    }

    public StreakData getChatStreakData(Integer groupId, Integer userId) {
        List<Message> messages = messageMapper.selectMessagesByGroupIdDesc(groupId);
        List<LocalDate> dates = new ArrayList<>();
        // collect distinct dates for which the user sent a message
        for (Message message : messages) {
            if (message.getSenderId().equals(userId)) {
                LocalDate date = message.getSentTime().toLocalDate();
                if (!dates.contains(date)) {
                    dates.add(date);
                }
            }
        }
        int streak = 0;
        for (int i = 0; i < dates.size() - 1; i++) {
            LocalDate current = dates.get(i);
            LocalDate next = dates.get(i + 1);
            if (current.minusDays(1).equals(next)) {
                streak++;
            } else {
                break;
            }
        }
        // determine if the streak is active - treat it as active if the most recent message date is either today or yesterday
        boolean active = false;
        LocalDate today = LocalDate.now();
        if (!dates.isEmpty()) {
            LocalDate mostRecent = dates.get(0);
            active = mostRecent.equals(today) || mostRecent.equals(today.minusDays(1));
        }
        return new StreakData(streak, active);
    }


    public class StreakData {
        private int streak;
        private boolean active;

        public StreakData(int streak, boolean active) {
            this.streak = streak;
            this.active = active;
        }
        public int getStreak() {return streak;}
        public boolean isActive() {return active;}
    }


    public Message sendImage(Integer senderId, Integer chatId, MultipartFile file) {
        try {
            //save to local directory
            String timeStamp = String.valueOf(System.currentTimeMillis());
            Path path = Paths.get(uploadBaseDir, "message", "user_id" + senderId + "_" + timeStamp + ".jpg");
            Files.copy(file.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);
            //update url on database
            return sendMessage(senderId, chatId, path.getFileName().toString(), "image");
        } catch (IOException e) {
            System.err.println(e);
            throw new CustomException(500, "File IO error when saving file on server");
        }
    }
}

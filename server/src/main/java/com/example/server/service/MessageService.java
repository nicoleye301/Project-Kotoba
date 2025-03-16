package com.example.server.service;

import com.example.server.entity.Message;
import com.example.server.exception.CustomException;
import com.example.server.mapper.MessageMapper;
import com.example.server.websocket.KTextWebSocket;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    @Resource
    private MessageMapper messageMapper;

    @Resource
    private KTextWebSocket kTextWebSocket;

    // get chat history for the given direct_chat_group_id
    public List<Message> getMessagesByGroupId(Integer groupId) {
        return messageMapper.selectMessagesByGroupId(groupId);
    }

    // send a new message: store in DB, then broadcast via WebSocket
    public Message sendMessage(Integer senderId, Integer groupId, String content) {
        try {
            Message msg = new Message();
            msg.setContent(content);
            msg.setSenderId(senderId);
            msg.setGroupId(groupId);
            msg.setType("plaintext");
            msg.setSentTime(LocalDateTime.now());
            msg.setStatus("sent");

            // insert into DB
            messageMapper.insertMessage(msg);

            // broadcast to WebSocket clients
            String broadcastData = String.format(
                    "{\"id\":%d,\"senderId\":%d,\"groupId\":%d,\"content\":\"%s\",\"timestamp\":\"%s\"}",
                    msg.getId(),
                    msg.getSenderId(),
                    msg.getGroupId(),
                    msg.getContent(),
                    msg.getSentTime().toString()
            );
            kTextWebSocket.broadcast(broadcastData);

            return msg;
        } catch (Exception e) {
            throw new CustomException(500, "Error sending message: " + e.getMessage());
        }
    }
}

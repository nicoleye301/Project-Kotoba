package com.example.server.service;

import com.example.server.exception.CustomException;
import com.example.server.websocket.KTextWebSocket;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

@Service
public class MessageService {

    @Resource
    private KTextWebSocket kTextWebSocket;

    /**
     * broadcasts message to all connected clients
     */
    public void broadcast(Integer groupId, String message) {
        try {
            kTextWebSocket.broadcast("Group " + groupId + ": " + message);
        } catch (Exception e) {
            throw new CustomException(500, "Error broadcasting message: " + e.getMessage());
        }
    }

    /**
     * sends a message to a specific user
     *
     * @param userId  the ID of the target user
     * @param message the message content
     */
    public void sendMessageToUser(Integer userId, String message) {
        try {
            //placeholder
            kTextWebSocket.broadcast("User " + userId + ": " + message);
        } catch (Exception e) {
            throw new CustomException(500, "Error sending message to user: " + e.getMessage());
        }
    }

    /**
     * sends a message to all members of a group
     *
     * @param groupId the group ID
     * @param message the message content
     */
    public void sendMessageToGroup(Integer groupId, String message) {
        try {
            //plcceholder
            kTextWebSocket.broadcast("Group " + groupId + ": " + message);
        } catch (Exception e) {
            throw new CustomException(500, "Error sending message to group: " + e.getMessage());
        }
    }
}

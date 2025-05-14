package com.example.server.websocket;

import com.example.server.entity.GroupMember;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;
import java.util.List;

@Component
public class KTextWebSocket extends TextWebSocketHandler {
    private static final HashMap<Integer, WebSocketSession> sessions = new HashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        Integer userId = getUserId(session);
        sessions.put(userId, session);
        System.out.println("Connection established: " + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Got message: " + message.getPayload());
        session.sendMessage(new TextMessage("Server got: " + message.getPayload()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        Integer userId = getUserId(session);
        sessions.remove(userId);
        System.out.println("Connection closed: " + session.getId());
    }

    public void broadcast(String message, List<GroupMember> groupMembers) throws Exception {
        for (GroupMember user: groupMembers) {
            WebSocketSession session = sessions.get(user.getUserId());
            if (session!=null){
                session.sendMessage(new TextMessage(message));
            }
        }
    }

    private Integer getUserId(WebSocketSession session){
        return Integer.parseInt((String) session.getAttributes().get("userId"));
    }
}

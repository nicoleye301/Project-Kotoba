package com.example.server.websocket;

import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;

@Component
public class KTextWebSocket extends TextWebSocketHandler {
    private static HashSet<WebSocketSession> sessions = new HashSet<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("Connection established：" + session.getId());
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Got message：" + message.getPayload());
        session.sendMessage(new TextMessage("Server got：" + message.getPayload()));
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed：" + session.getId());
        sessions.remove(session);
    }

    public void broadcast(String message) throws Exception {
        for (WebSocketSession i:sessions){
            i.sendMessage(new TextMessage(message));
        }
    }

}

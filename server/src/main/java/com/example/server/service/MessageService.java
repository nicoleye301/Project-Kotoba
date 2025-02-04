package com.example.server.service;

import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.UserMapper;
import com.example.server.websocket.KTextWebSocket;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Service
public class MessageService {

    KTextWebSocket websocket = new KTextWebSocket();

    public void broadcast(String s) throws Exception {
        websocket.broadcast(s);
    }
}

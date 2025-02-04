package com.example.server.controller;

import com.example.server.entity.User;
import com.example.server.service.MessageService;
import com.example.server.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public void send(@RequestBody Map<String, Object> data) throws Exception {
        String s = (String) data.get("message");
        messageService.broadcast(s);
    }
}

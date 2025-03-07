package com.example.server.controller;

import com.example.server.service.MessageService;
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
        Integer groupId = (Integer) data.get("groupId");
        String messageContent = (String) data.get("message");
        if (groupId == null || messageContent == null) {
            throw new IllegalArgumentException("groupId and message must be provided");
        }
        messageService.broadcast(groupId, messageContent);
    }
}

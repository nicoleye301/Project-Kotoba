package com.example.server.controller;

import com.example.server.entity.Message;
import com.example.server.exception.CustomException;
import com.example.server.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/message")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    // fetch chat history
    @GetMapping("/history")
    public List<Message> getChatHistory(@RequestParam("chatId") Integer chatId) {
        if (chatId == null) {
            throw new CustomException(400, "chatId is required");
        }
        return messageService.getMessagesByGroupId(chatId);
    }

    // send a message
    @PostMapping("/send")
    public Message sendMessage(@RequestBody Map<String, Object> data) {
        Integer senderId = (data.get("senderId") instanceof Number)
                ? ((Number) data.get("senderId")).intValue() : null;
        Integer chatId = (data.get("groupId") instanceof Number)
                ? ((Number) data.get("groupId")).intValue() : null;
        String type = (String) data.get("type");
        String content = (String) data.get("content");

        if (senderId == null || chatId == null || content == null) {
            throw new CustomException(400, "senderId, groupId (chatId), and content are required");
        }

        return messageService.sendMessage(senderId, chatId, content, type);
    }
}

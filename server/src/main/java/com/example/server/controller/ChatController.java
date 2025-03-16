package com.example.server.controller;

import com.example.server.entity.Message;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/chat")
public class ChatController {
    @GetMapping("/history")
    public List<Message> getChatHistory(@RequestParam Integer conversationId,
                                        @RequestParam Boolean isGroup) {
        // return dummy messages for testing
        List<Message> dummyMessages = new ArrayList<>();
        // ... populate with dummy data
        return dummyMessages;
    }
}

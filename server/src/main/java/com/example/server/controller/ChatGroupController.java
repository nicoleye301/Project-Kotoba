package com.example.server.controller;

import com.example.server.entity.ChatGroup;
import com.example.server.exception.CustomException;
import com.example.server.service.ChatGroupService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/chat-group")
public class ChatGroupController {

    private final ChatGroupService chatGroupService;

    public ChatGroupController(ChatGroupService chatGroupService) {
        this.chatGroupService = chatGroupService;
    }

    // create a new group chat
    @PostMapping("/create")
    public ChatGroup createGroup(@RequestBody Map<String, Object> data) {
        Integer ownerId = (data.get("ownerId") instanceof Number)
                ? ((Number) data.get("ownerId")).intValue() : null;
        String groupName = (String) data.get("groupName");
        List<Integer> memberIds = (List<Integer>) data.get("memberIds");

        if (ownerId == null || groupName == null || groupName.trim().isEmpty()) {
            throw new CustomException(400, "Owner ID and group name are required");
        }
        if (memberIds == null || memberIds.isEmpty()) {
            throw new CustomException(400, "At least one member must be provided");
        }

        return chatGroupService.createGroup(ownerId, groupName, memberIds);
    }

    @GetMapping("/list")
    public List<ChatGroup> listGroupChats(@RequestParam Integer userId) {
        return chatGroupService.getGroupChatsForUser(userId);
    }

    @GetMapping("/getAvatars")
    public Map<String, Object> getAvatars(@RequestParam Integer chatId) {
        return chatGroupService.getAvatars(chatId);
    }
}

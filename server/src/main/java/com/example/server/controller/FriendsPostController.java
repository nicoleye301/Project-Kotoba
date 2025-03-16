package com.example.server.controller;

import com.example.server.entity.FriendPost;
import com.example.server.entity.User;
import com.example.server.service.FriendsPostService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/friendPost")
public class FriendsPostController {

    private final FriendsPostService friendsPostService;

    public FriendsPostController(FriendsPostService friendsPostService) { this.friendsPostService = friendsPostService; }

    @PostMapping("/retrieveFriendPost")
    public FriendPost retrievePost(@RequestBody Map<String, Object> body) {
        return friendsPostService.retrievePost((User) body.get("username"), (Integer) body.get("id"));
    }

    @PostMapping("/friendPost")
    public void post(@RequestBody Map<String, Object> body) {
        friendsPostService.post((User) body.get("username"), (String) body.get("contents"));
    }
}

package com.example.server.controller;

import com.example.server.entity.FriendPost;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.service.FriendsPostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friendPost")
public class FriendsPostController {

    private final FriendsPostService friendsPostService;

    public FriendsPostController(FriendsPostService friendsPostService) { this.friendsPostService = friendsPostService; }

    //Make return a list of friend's posts
    @GetMapping("/retrieveFriendPost")
    public List<FriendPost> retrievePost(@RequestParam("posterId") Integer posterId) {
        if(posterId == null) {
            throw new CustomException(400, "posterId is required");
        }
        return friendsPostService.retrievePost(posterId);
    }

    @PostMapping("/postFriendPost")
    public FriendPost post(@RequestBody Map<String, Object> data) {
        System.out.println("Post1");

        Integer posterId = (data.get("posterId") instanceof Number)
                ? ((Number) data.get("posterId")).intValue() : null;
        String imageURL = (String) data.get("imageURL");
        String content = (String) data.get("content");
        if(posterId == null || content == null) {
            throw new CustomException(400, "posterId and content are required");
        }

        return friendsPostService.post(posterId, imageURL, content);
    }
}

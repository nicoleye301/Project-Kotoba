package com.example.server.controller;

import com.example.server.entity.PostLike;
import com.example.server.exception.CustomException;
import com.example.server.service.PostLikeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/likePost")
public class PostLikeController {

    private final PostLikeService postLikeService;

    public PostLikeController(PostLikeService postLikeService) { this.postLikeService = postLikeService; }

    @GetMapping("/retrievePostLikes")
    public List<PostLike> retrievePostLike(@RequestParam("postId") Integer postId) {
        if(postId == null) {
            throw new CustomException(400, "postId is required");
        }
        return postLikeService.retrievePostLike(postId);
    }

    @PostMapping("/likePost")
    public PostLike likePost(@RequestBody Map<String, Object> data) {
        Integer postId = (data.get("postId") instanceof Number)
                ? ((Number) data.get("postId")).intValue() : null;
        Integer senderId = (data.get("senderId") instanceof Number)
                ? ((Number) data.get("senderId")).intValue() : null;
        if(postId == null || senderId == null) {
            throw new CustomException(400, "postId, senderId and content are required");
        }
        return postLikeService.likePost(postId, senderId);
    }

    @PostMapping("/dislikePost")
    public PostLike dislikePost(@RequestBody Map<String, Object> data) {
        Integer postId = (data.get("postId") instanceof Number)
                ? ((Number) data.get("postId")).intValue() : null;
        Integer senderId = (data.get("senderId") instanceof Number)
                ? ((Number) data.get("senderId")).intValue() : null;
        if(postId == null || senderId == null) {
            throw new CustomException(400, "postId, senderId and content are required");
        }
        return postLikeService.dislikePost(postId, senderId);
    }
}

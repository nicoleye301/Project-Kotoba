package com.example.server.controller;

import com.example.server.entity.PostComment;
import com.example.server.exception.CustomException;
import com.example.server.service.PostCommentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/postComment")
public class PostCommentController {

    private final PostCommentService postCommentService;

    public PostCommentController(PostCommentService postCommentService) { this.postCommentService = postCommentService; }

    @GetMapping("/retrievePostComment")
    public List<PostComment> retrievePostComment(@RequestParam("postId") Integer postId) {
        if(postId == null) {
            throw new CustomException(400, "postId is required");
        }
        return postCommentService.retrievePostComment(postId);
    }

    @PostMapping("/commentPostComment")
    public PostComment commentPostComment(@RequestBody Map<String, Object> data) {
        Integer postId = (data.get("postId") instanceof Number)
                ? ((Number) data.get("postId")).intValue() : null;
        Integer senderId = (data.get("senderId") instanceof Number)
                ? ((Number) data.get("senderId")).intValue() : null;
        String content = (String) data.get("content");
        if(postId == null || senderId == null || content == null) {
            throw new CustomException(400, "postId, senderId and content are required");
        }

        return postCommentService.comment(postId, senderId, content);
    }
}

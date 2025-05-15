package com.example.server.service;

import com.example.server.entity.PostComment;
import com.example.server.exception.CustomException;
import com.example.server.mapper.PostCommentMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostCommentService {

    @Resource
    private PostCommentMapper postCommentMapper;

    public List<PostComment> retrievePostComment(Integer postId) {
        return postCommentMapper.selectCommentsByPostId(postId);
    }

    public PostComment comment(Integer postId, Integer senderId, String content) {
       try{
           PostComment postComment = new PostComment();
           postComment.setPostId(postId);
           postComment.setSenderId(senderId);
           postComment.setContent(content);
           postComment.setPostTime(LocalDateTime.now());

           postComment.setId(postCommentMapper.insertPostComment(postComment));

           return postComment;

       } catch(Exception e) {
           throw new CustomException(500, "Error commenting: " + e.getMessage());
       }

    }
}

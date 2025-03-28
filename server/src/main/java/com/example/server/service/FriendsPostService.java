package com.example.server.service;

import com.example.server.entity.FriendPost;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.PostMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FriendsPostService {

    @Resource
    private PostMapper postMapper;

    public List<FriendPost> retrievePost(Integer posterId) {
        return postMapper.selectPostsByPosterId(posterId);
    }

    public FriendPost post(Integer posterId, String imageURL, String content) {
        try {
            FriendPost post = new FriendPost();
            post.setPosterId(posterId);
            post.setImageURL(imageURL);
            post.setContent(content);
            post.setPostTime(LocalDateTime.now());

            postMapper.insertPost(post);

            return post;
        } catch(Exception e) {
            throw new CustomException(500, "Error posting: " + e.getMessage());
        }
    }

}

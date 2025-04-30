package com.example.server.service;

import com.example.server.entity.FriendPost;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.PostMapper;
import com.example.server.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class FriendsPostService {

    @Resource
    private PostMapper postMapper;

    @Autowired
    private UserMapper userMapper;

    @Value("${upload-directory}")
    private String uploadBaseDir;

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

            post.setId(postMapper.insertPost(post));

            return post;
        } catch(Exception e) {
            throw new CustomException(500, "Error posting: " + e.getMessage());
        }
    }

    public Map<String, Object> getAvatar(Integer[] friendIds) {
        Map<String, Object> result = new HashMap<>();
        for(Integer friendId : friendIds) {
            Map<String, String> item = new HashMap<>();
            User user = userMapper.selectById(friendId);
            item.put("username", user.getUsername());
            item.put("url", user.getAvatar());
            result.put(Integer.toString(friendId), item);
        }
        return result;
    }
}

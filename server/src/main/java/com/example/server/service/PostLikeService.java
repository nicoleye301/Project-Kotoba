package com.example.server.service;

import com.example.server.entity.PostLike;
import com.example.server.exception.CustomException;
import com.example.server.mapper.PostLikeMapper;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostLikeService {

    @Resource
    private PostLikeMapper postLikeMapper;

    public List<PostLike> retrievePostLike(Integer postId) {
        return postLikeMapper.selectLikesByPostId(postId);
    }

    public PostLike likePost(Integer postId, Integer senderId) {
        List<PostLike> postLikeDatabase = postLikeMapper.selectLikeByPostIdAndSenderId(postId, senderId);
        try {
            PostLike postLike;
            if(postLikeDatabase == null || postLikeDatabase.isEmpty())
            {
                System.out.println("adding like to database");
                postLike = new PostLike();
                postLike.setPostId(postId);
                postLike.setSenderId(senderId);
                postLike.setContent("like");
                postLikeMapper.insertPostLike(postLike);
            }
            else
            {
                postLike = postLikeDatabase.get(0);
                System.out.println("PostLikeDatabase: post id: " + postLikeDatabase.get(0).getPostId() + ", sender id: " + postLikeDatabase.get(0).getSenderId() + ", content: " + postLikeDatabase.get(0).getContent());
                System.out.println("postLike: post id: " + postLike.getPostId() + ", sender id: " + postLike.getSenderId() + ", content: " + postLike.getContent());
                if(postLikeDatabase.get(0).getContent().equals("like"))
                {
                    System.out.println("deleting like from database");
                    postLikeMapper.deleteLikeByPostIdAndSenderId(postId, senderId);
                }
                else
                {
                    System.out.println("changing dislike to like in database");
                    postLike.setContent("like");
                    postLikeMapper.updatePostLike(postLike);
                }
            }
            return postLike;
        } catch(Exception e) {
            throw new CustomException(500, "Error liking: " + e.getMessage());
        }
    }

    public PostLike dislikePost(Integer postId, Integer senderId) {
        List<PostLike> postLikeDatabase = postLikeMapper.selectLikeByPostIdAndSenderId(postId, senderId);
        try {
            PostLike postLike;
            if(postLikeDatabase == null || postLikeDatabase.isEmpty())
            {
                System.out.println("adding dislike to database");
                postLike = new PostLike();
                postLike.setPostId(postId);
                postLike.setSenderId(senderId);
                postLike.setContent("dislike");
                postLikeMapper.insertPostLike(postLike);
            }
            else
            {
                postLike = postLikeDatabase.get(0);
                System.out.println("PostLikeDatabase: post id: " + postLikeDatabase.get(0).getPostId() + ", sender id: " + postLikeDatabase.get(0).getSenderId() + ", content: " + postLikeDatabase.get(0).getContent());
                System.out.println("postLike: post id: " + postLike.getPostId() + ", sender id: " + postLike.getSenderId() + ", content: " + postLike.getContent());

                if(postLikeDatabase.get(0).getContent().equals("dislike"))
                {
                    System.out.println("deleting dislike from database");
                    postLikeMapper.deleteLikeByPostIdAndSenderId(postId, senderId);
                }
                else
                {
                    System.out.println("changing like to dislike in database");
                    postLike.setContent("dislike");
                    postLikeMapper.updatePostLike(postLike);
                }
            }
            return postLike;
        } catch(Exception e) {
            throw new CustomException(500, "Error liking: " + e.getMessage());
        }

    }
}

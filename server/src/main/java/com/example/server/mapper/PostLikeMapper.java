package com.example.server.mapper;

import com.example.server.entity.PostLike;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PostLikeMapper {
    List<PostLike> selectLikesByPostId(@Param("postId") Integer postId);

    List<PostLike> selectLikeByPostIdAndSenderId(@Param("postId") Integer postId, @Param("senderId") Integer senderId);

    void insertPostLike(PostLike postLike);

    void updatePostLike(PostLike postLike);

    void deleteLikeByPostIdAndSenderId(@Param("postId") Integer postId, @Param("senderId") Integer senderId);
}

package com.example.server.mapper;

import com.example.server.entity.PostComment;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PostCommentMapper {
    List<PostComment> selectCommentsByPostId(@Param("postId") Integer postId);

    Integer insertPostComment(PostComment postComment);
}

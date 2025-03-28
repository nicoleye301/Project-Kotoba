package com.example.server.mapper;

import com.example.server.entity.FriendPost;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface PostMapper {
    List<FriendPost> selectPostsByPosterId(@Param("posterId") Integer posterId);

    void insertPost(FriendPost post);
}

package com.example.server.mapper;

import com.example.server.entity.FriendPost;

public interface PostMapper {
    FriendPost selectByID(int id);

    void insertPost(FriendPost post);
}

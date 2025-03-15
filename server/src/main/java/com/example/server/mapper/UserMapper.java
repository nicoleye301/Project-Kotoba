package com.example.server.mapper;

import com.example.server.entity.User;

import java.util.List;

public interface UserMapper {
    User selectByUsername(String username);
    void add(User user);

    // search users by username
    List<User> searchByUsername(String username);

    User selectById(Integer id);
}

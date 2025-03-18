package com.example.server.mapper;

import com.example.server.entity.User;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface UserMapper {
    User selectByUsername(String username);
    void add(User user);

    //select user by ID
    User selectById(@Param("id") Integer id);

    // search users by username
    List<User> searchByUsername(String username);

    void updateSettings(@Param("id") Integer id, @Param("settings") String settings);

    void updateAvatar(@Param("id") Integer id, @Param("avatar") String settings);

    void setPassword(@Param("id") Integer id, @Param("password") String password);
}

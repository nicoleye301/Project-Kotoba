package com.example.server.mapper;

import com.example.server.entity.User;

import java.util.List;

public interface UserMapper {
    User selectByUsername(String username);
}

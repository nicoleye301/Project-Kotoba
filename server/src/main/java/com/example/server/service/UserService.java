package com.example.server.service;

import com.example.server.entity.User;
import com.example.server.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Resource
    private UserMapper userMapper;


    public List<User> selectAll() {
        return userMapper.selectAll();
    }
}

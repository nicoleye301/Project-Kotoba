package com.example.server.service;

import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.UserMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    @Resource
    private UserMapper userMapper;

    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user==null){
            throw new CustomException(500, "Username not found");
        }
        if(!Objects.equals(password, user.getPassword())){
            throw new CustomException(500, "wrong password");
        }
        return user;
    }

    public void register(User user) {
        userMapper.add(user);
    }
}

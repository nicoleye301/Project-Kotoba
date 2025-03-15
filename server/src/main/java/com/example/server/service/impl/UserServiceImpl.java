package com.example.server.service.impl;

import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.UserMapper;
import com.example.server.service.UserService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;

@Service
public class UserServiceImpl implements UserService {

    @Resource
    private UserMapper userMapper;

    @Override
    public User login(String username, String password) {
        User user = userMapper.selectByUsername(username);
        if (user == null) {
            throw new CustomException(500, "Username not found");
        }
        if (!Objects.equals(password, user.getPassword())) {
            throw new CustomException(500, "Wrong password");
        }
        return user;
    }

    @Override
    public void register(User user) {
        userMapper.add(user);
    }

    @Override
    public User getUserById(Integer id) {
        User user = userMapper.selectById(id);
        if (user == null) {
            throw new CustomException(404, "User not found");
        }
        return user;
    }

    @Override
    public List<User> searchUsers(String username) {
        return userMapper.searchByUsername(username);
    }
}

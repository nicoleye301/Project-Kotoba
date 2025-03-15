package com.example.server.service;

import com.example.server.entity.User;
import java.util.List;

public interface UserService {
    User login(String username, String password);
    void register(User user);
    User getUserById(Integer id);
    List<User> searchUsers(String username);
}

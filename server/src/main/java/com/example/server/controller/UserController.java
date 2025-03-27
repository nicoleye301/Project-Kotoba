package com.example.server.controller;

import com.example.server.entity.User;
import com.example.server.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/user")
public class UserController {

    private final UserService userService;

    @Value("${upload-directory}")
    private String uploadBaseDir;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/login")
    public User login(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String password = (String) body.get("password");
        return userService.login(username, password);
    }

    @PostMapping("/register")
    public void register(@RequestBody User user) {
        userService.register(user);
    }

    @GetMapping("/details")
    public User getUserDetails(@RequestParam Integer userId) {
        return userService.getUserById(userId);
    }

    @PostMapping("/uploadSettings")
    public void updateSettings(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String settings = (String) body.get("settings");
        userService.updateSettings(userId, settings);
    }

    @PostMapping("/setPassword")
    public void setPassword(@RequestBody Map<String, Object> body) {
        String userId = (String) body.get("userId");
        String password = (String) body.get("password");
        userService.setPassword(userId, password);
    }

    @PostMapping("/uploadAvatar")
    public void uploadAvatar(@RequestParam("userId") String userId, @RequestParam("avatar") MultipartFile avatar) {
        String timeStamp = String.valueOf(System.currentTimeMillis());
        Path path = Paths.get(uploadBaseDir, "avatar", "user_id" + userId + "_" + timeStamp + ".jpg");
        userService.uploadFile(userId, avatar, path);
    }

    @GetMapping("/getStreaks")
    public List<Map<String, Object>> getStreaks(@RequestParam String userId) {
        return userService.getChatStreaks(userId);
    }

    @GetMapping("/getMilestones")
    public List<Map<String, Object>> getMilestones(@RequestParam String userId) {
        return userService.getMilestones(userId);
    }

    @GetMapping("/getOneToOneFrequency")
    public List<Map<String, Object>> getOneToOneFrequency(@RequestParam String userId) {
        return userService.getOneToOneChatFrequency(userId);
    }
}

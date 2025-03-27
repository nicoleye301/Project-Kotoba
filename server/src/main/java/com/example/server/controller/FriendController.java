package com.example.server.controller;

import com.example.server.entity.Friendship;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.FriendshipMapper;
import com.example.server.service.FriendshipService;
import com.example.server.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/friend")
public class FriendController {

    private final FriendshipService friendshipService;
    private final UserService userService;

    public FriendController(FriendshipService friendshipService, UserService userService) {
        this.friendshipService = friendshipService;
        this.userService = userService;
    }

    // send a friend request
    @PostMapping("/request")
    public String sendFriendRequest(@RequestBody Map<String, Object> data) {
        Integer senderId = (data.get("userId") instanceof Number)
                ? ((Number) data.get("userId")).intValue() : null;
        Integer receiverId = (data.get("friendId") instanceof Number)
                ? ((Number) data.get("friendId")).intValue() : null;
        String friendUsername = (String) data.get("friendUsername");

        if (senderId == null) {
            throw new CustomException(400, "Missing userId");
        }

        if (receiverId == null && friendUsername != null) {
            List<User> users = userService.searchUsers(friendUsername);
            if (users.isEmpty()) {
                throw new CustomException(404, "No user found with username: " + friendUsername);
            }
            receiverId = users.get(0).getId();
        }

        if (receiverId == null) {
            throw new CustomException(400, "Friend ID or Friend Username must be provided");
        }

        if (senderId.equals(receiverId)) {
            throw new CustomException(400, "You cannot send a friend request to yourself.");
        }

        friendshipService.sendFriendRequest(senderId, receiverId);
        return "Friend request sent";
    }

    // accept a friend request
    @PostMapping("/accept")
    public String acceptFriendRequest(@RequestBody Map<String, Object> data) {
        Integer id = (data.get("id") instanceof Number)
                ? ((Number) data.get("id")).intValue() : null;

        friendshipService.acceptFriendRequest(id);
        return "Friend request accepted";
    }

    // decline a friend request
    @PostMapping("/decline")
    public String declineFriendRequest(@RequestBody Map<String, Object> data) {
        Integer id = (data.get("id") instanceof Number)
                ? ((Number) data.get("id")).intValue() : null;

        friendshipService.declineFriendRequest(id);
        return "Friend request declined";
    }

    // get list of accepted friends for the specified user
    @GetMapping("/list")
    public List<Friendship> listFriends(@RequestParam Integer userId) {
        return friendshipService.getAcceptedFriends(userId);
    }

    // get list of pending friend requests for the specified user
    @GetMapping("/pending")
    public List<Friendship> listPending(@RequestParam Integer userId) {
        return friendshipService.getPendingFriendRequests(userId);
    }

    // remove a friendship between two users
    @PostMapping("/remove")
    public String removeFriend(@RequestBody Map<String, Object> data) {
        Integer userId = (data.get("userId") instanceof Number)
                ? ((Number) data.get("userId")).intValue() : null;
        Integer friendId = (data.get("friendId") instanceof Number)
                ? ((Number) data.get("friendId")).intValue() : null;

        if (userId == null || friendId == null) {
            throw new CustomException(400, "Both userId and friendId must be provided");
        }

        friendshipService.removeFriend(userId, friendId);
        return "Friend removed";
    }

    @PostMapping("/setMilestone")
    public String setMilestone(@RequestBody Map<String, Object> data) {
        Integer currentUserId = (data.get("currentUserId") instanceof Number)
                ? ((Number) data.get("currentUserId")).intValue() : null;
        Integer friendId = (data.get("friendId") instanceof Number)
                ? ((Number) data.get("friendId")).intValue() : null;
        String milestoneSettings = (String) data.get("milestoneSettings");

        if (currentUserId == null || friendId == null || milestoneSettings == null) {
            throw new CustomException(400, "currentUserId, friendId and milestoneSettings are required");
        }

        friendshipService.setMilestone(currentUserId, friendId, milestoneSettings);
        return "Milestone updated";
    }

}

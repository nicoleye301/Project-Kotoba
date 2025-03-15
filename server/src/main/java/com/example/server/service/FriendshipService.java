package com.example.server.service;

import com.example.server.entity.Friendship;
import java.util.List;
import java.util.Map;

public interface FriendshipService {
    void sendFriendRequest(Integer senderId, Integer receiverId);
    void acceptFriendRequest(Integer id);
    void declineFriendRequest(Integer id);
    List<Map<String, Object>> getAcceptedFriends(Integer userId);
    List<Friendship> getPendingFriendRequests(Integer receiverId);
    void removeFriend(Integer userId, Integer friendId);
}

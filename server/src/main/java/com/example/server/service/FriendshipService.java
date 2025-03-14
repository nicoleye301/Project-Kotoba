package com.example.server.service;

import com.example.server.entity.Friendship;
import java.util.List;

public interface FriendshipService {
    void sendFriendRequest(Integer senderId, Integer receiverId);
    void acceptFriendRequest(Integer receiverId, Integer senderId);
    void declineFriendRequest(Integer receiverId, Integer senderId);
    List<Friendship> getAcceptedFriends(Integer userId);
    List<Friendship> getPendingFriendRequests(Integer receiverId);
    void removeFriend(Integer userId, Integer friendId);
}

package com.example.server.service;

import com.example.server.entity.Friendship;
import com.example.server.exception.CustomException;
import com.example.server.mapper.FriendshipMapper;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.util.List;

@Service
public class FriendshipService {

    @Resource
    private FriendshipMapper friendshipMapper;

    public void sendFriendRequest(Integer senderId, Integer receiverId) {
        if (senderId.equals(receiverId)) {
            throw new CustomException(400, "You cannot friend yourself.");
        }
        // check if a friendship record already exists
        Friendship existing = friendshipMapper.selectByUserIdAndFriendId(senderId, receiverId);
        if (existing != null) {
            throw new CustomException(400, "Friend request already sent or already friends.");
        }
        Friendship friendship = new Friendship();
        friendship.setUserId(senderId);      // always store sender in userId
        friendship.setFriendId(receiverId);  // receiver in friendId
        friendship.setStatus("pending");
        friendshipMapper.insert(friendship);
    }

    public void acceptFriendRequest(Integer id) {
        // find the pending request
        Friendship friendship = friendshipMapper.selectByFriendshipId(id);
        if (friendship == null || !"pending".equals(friendship.getStatus())) {
            throw new CustomException(400, "No pending friend request found");
        }

        // set to accepted
        friendship.setStatus("accepted");

        // if no directChatGroupId, create one
        if (friendship.getDirectChatGroupId() == null) {
            Integer newChatId = createNewDirectChatId();
            friendship.setDirectChatGroupId(newChatId);
        }

        friendshipMapper.update(friendship);

        // create reciprocal record
        int userId = friendship.getFriendId();
        int friendId = friendship.getUserId();

        Friendship reciprocal = friendshipMapper.selectByUserIdAndFriendId(userId, friendId);
        if (reciprocal == null) {
            reciprocal = new Friendship();
            reciprocal.setUserId(userId);
            reciprocal.setFriendId(friendId);
            reciprocal.setStatus("accepted");
            reciprocal.setDirectChatGroupId(friendship.getDirectChatGroupId());
            friendshipMapper.insert(reciprocal);
        } else {
            reciprocal.setStatus("accepted");
            if (reciprocal.getDirectChatGroupId() == null) {
                reciprocal.setDirectChatGroupId(friendship.getDirectChatGroupId());
            }
            friendshipMapper.update(reciprocal);
        }
    }

    private Integer createNewDirectChatId() {
        return (int)(System.currentTimeMillis() / 1000);
    }

    public void declineFriendRequest(Integer id) {
        Friendship friendship = friendshipMapper.selectByFriendshipId(id);
        if (friendship == null || !"pending".equals(friendship.getStatus())) {
            throw new CustomException(400, "No pending friend request found");
        }
        friendship.setStatus("declined");
        friendshipMapper.update(friendship);
    }

    public List<Friendship> getAcceptedFriends(Integer userId) {
        // get all friend records where the user is either the sender or receiver and status is accepted
        // remove duplicates if any
        return friendshipMapper.selectFriendshipsByUser(userId);
    }

    public List<Friendship> getPendingFriendRequests(Integer receiverId) {
        // for pending requests, the receiver is always stored in friend_id
        return friendshipMapper.selectPendingForReceiver(receiverId);
    }

    public void removeFriend(Integer userId, Integer friendId) {
        // remove any friendship record in either direction for the given pair
        Friendship friendship = friendshipMapper.selectByUserIdAndFriendId(userId, friendId);
        if (friendship != null) {
            friendshipMapper.delete(friendship);
        }
        Friendship reciprocal = friendshipMapper.selectByUserIdAndFriendId(friendId, userId);
        if (reciprocal != null) {
            friendshipMapper.delete(reciprocal);
        }
    }
}

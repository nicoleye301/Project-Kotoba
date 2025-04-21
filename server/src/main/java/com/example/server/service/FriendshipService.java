package com.example.server.service;

import com.example.server.entity.Friendship;
import com.example.server.exception.CustomException;
import com.example.server.mapper.FriendshipMapper;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    @Resource
    private FriendshipMapper friendshipMapper;

    @Resource
    private GroupMemberService groupMemberService;

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

        // ensure both users are added to the group_member table for this direct chat
        groupMemberService.addMember(friendship.getDirectChatGroupId(), friendship.getUserId());
        groupMemberService.addMember(friendship.getDirectChatGroupId(), friendship.getFriendId());
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
        // more robust, guarantess that each friendship appears only once
        List<Friendship> list = friendshipMapper.selectFriendshipsByUser(userId);
        return list.stream()
                .filter(f -> "accepted".equals(f.getStatus()))
                .collect(Collectors.toList());
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

    public void setMilestone(Integer currentUserId, Integer friendId, String milestoneSettings) {
        Friendship friendship = friendshipMapper.selectByUserIdAndFriendId(currentUserId, friendId);
        if (friendship == null) {
            throw new CustomException(404, "Friendship not found");
        }
        friendshipMapper.updateMilestoneSettings(friendship.getId(), milestoneSettings);
    }

    public void setNickname(Integer userId, Integer friendId, String nickname) {
        Friendship friendship = friendshipMapper.selectByUserIdAndFriendId(userId, friendId);
        if (friendship == null || !"accepted".equals(friendship.getStatus())) {
            throw new CustomException(404, "Friendship not found or not accepted");
        }
        friendship.setNickname(nickname);
        friendshipMapper.update(friendship);
    }

    public Friendship getFriendship(Integer userId, Integer friendId) {
        return friendshipMapper.selectByUserIdAndFriendId(userId, friendId);
    }

}

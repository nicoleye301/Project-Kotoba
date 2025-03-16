package com.example.server.mapper;

import com.example.server.entity.Friendship;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface FriendshipMapper {
    // insert a new friendship record
    void insert(Friendship friendship);

    // update an existing friendship
    void update(Friendship friendship);

    // select a friendship record by userId and friendId
    Friendship selectByUserIdAndFriendId(@Param("userId") Integer userId, @Param("friendId") Integer friendId);

    Friendship selectByFriendshipId(@Param("id") Integer id);

    // select all friendship records for a user (as sender only)
    List<Friendship> selectByUserId(Integer userId);

    // select all friendship records where the user is either the requester or the receiver
    List<Friendship> selectFriendshipsByUser(@Param("userId") Integer userId);

    // select pending friend requests for the given receiver
    List<Friendship> selectPendingForReceiver(@Param("receiverId") Integer receiverId);

    // delete a friendship record
    void delete(Friendship friendship);
}

package com.example.server.mapper;

import com.example.server.entity.ChatGroup;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface ChatGroupMapper {
    // insert a new group chat record
    void insertChatGroup(ChatGroup chatGroup);

    // select a group by id
    ChatGroup selectChatGroupById(@Param("id") Integer id);

    // update group details if needed
    void updateChatGroup(ChatGroup chatGroup);

    // get all groups that a user belongs to
    List<ChatGroup> selectChatGroupsByUserId(@Param("userId") Integer userId);

    List<ChatGroup> selectChatGroupsByIds(List<Integer> groupIds);
}

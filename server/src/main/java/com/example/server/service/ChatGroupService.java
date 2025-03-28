package com.example.server.service;

import com.example.server.entity.ChatGroup;
import com.example.server.entity.GroupMember;
import com.example.server.entity.User;
import com.example.server.exception.CustomException;
import com.example.server.mapper.ChatGroupMapper;
import com.example.server.mapper.GroupMemberMapper;
import com.example.server.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.Resource;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatGroupService {

    @Resource
    private ChatGroupMapper chatGroupMapper;

    @Resource
    private GroupMemberMapper groupMemberMapper;
    @Autowired
    private UserMapper userMapper;

    // create a new group chat (for multi-user groups)
    public ChatGroup createGroup(Integer ownerId, String groupName, List<Integer> memberIds) {
        if (ownerId == null || groupName == null || groupName.trim().isEmpty()) {
            throw new CustomException(400, "Owner ID and group name are required");
        }
        // create ChatGroup object and mark as group chat (true)
        ChatGroup group = new ChatGroup();
        group.setOwnerId(ownerId);
        group.setIsGroup(true);
        group.setGroupName(groupName);
        chatGroupMapper.insertChatGroup(group);

        // ensure the owner is in the list of member IDs
        if (!memberIds.contains(ownerId)) {
            memberIds.add(ownerId);
        }

        // for each member, create a GroupMember record
        for (Integer memberId : memberIds) {
            GroupMember member = new GroupMember();
            member.setUserId(memberId);
            member.setGroupId(group.getId());
            groupMemberMapper.insert(member);
        }

        return group;
    }

    // fetch all group chats for a user
    public List<ChatGroup> getGroupChatsForUser(Integer userId) {
        List<Integer> groupIds = groupMemberMapper.selectGroupIdsByUserId(userId);
        if (groupIds == null || groupIds.isEmpty()) {
            return List.of();
        }
        return chatGroupMapper.selectChatGroupsByIds(groupIds);
    }

    public Map<String, Object> getAvatars(Integer chatId) {
        List<GroupMember> members = groupMemberMapper.selectByGroupId(chatId);
        Map<String, Object> result = new HashMap<>();
        for(GroupMember member:members){
            int id = member.getUserId();
            Map<String, String> item = new HashMap<>();
            User user = userMapper.selectById(id);
            item.put("username", user.getUsername());
            item.put("url", user.getAvatar());
            result.put(Integer.toString(id), item);
        }
        return result;
    }
}
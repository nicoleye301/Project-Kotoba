package com.example.server.mapper;

import com.example.server.entity.GroupMember;
import java.util.List;

public interface GroupMemberMapper {
    void insert(GroupMember member);
    void delete(GroupMember member);
    List<GroupMember> selectByGroupId(Integer groupId);

    List<Integer> selectGroupIdsByUserId(Integer userId);
}

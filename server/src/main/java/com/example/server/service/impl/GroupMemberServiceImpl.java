package com.example.server.service.impl;

import com.example.server.entity.GroupMember;
import com.example.server.mapper.GroupMemberMapper;
import com.example.server.service.GroupMemberService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GroupMemberServiceImpl implements GroupMemberService {

    @Resource
    private GroupMemberMapper groupMemberMapper;

    @Override
    public void addMember(Integer groupId, Integer userId) {
        GroupMember member = new GroupMember();
        member.setGroupId(groupId);
        member.setUserId(userId);
        groupMemberMapper.insert(member);
    }

    @Override
    public void removeMember(Integer groupId, Integer userId) {
        GroupMember member = new GroupMember();
        member.setGroupId(groupId);
        member.setUserId(userId);
        groupMemberMapper.delete(member);
    }

    @Override
    public List<GroupMember> getMembers(Integer groupId) {
        // use method selectByGroupId defined in the mapper
        return groupMemberMapper.selectByGroupId(groupId);
    }
}

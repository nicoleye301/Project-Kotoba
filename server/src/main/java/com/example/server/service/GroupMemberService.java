package com.example.server.service;

import com.example.server.entity.GroupMember;
import com.example.server.mapper.GroupMemberMapper;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GroupMemberService {

    @Resource
    private GroupMemberMapper groupMemberMapper;

    public void addMember(Integer groupId, Integer userId) {
        GroupMember member = new GroupMember();
        member.setGroupId(groupId);
        member.setUserId(userId);
        groupMemberMapper.insert(member);
    }

    public void removeMember(Integer groupId, Integer userId) {
        GroupMember member = new GroupMember();
        member.setGroupId(groupId);
        member.setUserId(userId);
        groupMemberMapper.delete(member);
    }

    public List<GroupMember> getMembers(Integer groupId) {
        // use method selectByGroupId defined in the mapper
        return groupMemberMapper.selectByGroupId(groupId);
    }
}

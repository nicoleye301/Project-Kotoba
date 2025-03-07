package com.example.server.service;

import com.example.server.entity.GroupMember;
import java.util.List;

public interface GroupMemberService {
    void addMember(Integer groupId, Integer userId);
    void removeMember(Integer groupId, Integer userId);
    List<GroupMember> getMembers(Integer groupId);
}

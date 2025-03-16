package com.example.server.mapper;

import com.example.server.entity.Message;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface MessageMapper {

    // insert a new message
    void insertMessage(Message message);

    // select all messages for a given direct chat group, ordered by sent_time ascending
    List<Message> selectMessagesByGroupId(@Param("groupId") Integer groupId);
}

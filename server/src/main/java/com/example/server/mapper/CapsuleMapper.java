package com.example.server.mapper;

import com.example.server.entity.Capsule;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface CapsuleMapper {

    /**
     * insert a new capsule. Generated key will be set into capsule.id
     */
    void insertCapsule(Capsule capsule);

    /**
     * fetch all capsules created by a given user (both past and future unlock_times)
     */
    List<Capsule> selectByCreator(@Param("creatorId") Integer creatorId);

    /**
     * fetch only those capsules whose unlock_time has passed and which are not yet marked unlocked,
     * for a given target user
     */
    List<Capsule> selectReadyCapsulesByTarget(@Param("targetUserId") Integer targetUserId);

    /**
     * mark a capsule as unlocked so it won’t be returned again
     */
    int markCapsuleUnlocked(@Param("id") Integer id);

    /**
     * fetch a single capsule by its id
     */
    Capsule selectById(@Param("id") Integer id);
}

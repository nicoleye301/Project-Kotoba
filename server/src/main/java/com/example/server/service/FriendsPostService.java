package com.example.server.service;

import com.example.server.entity.FriendPost;
import com.example.server.entity.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;

@Service
public class FriendsPostService {

    private HashMap<User, ArrayList<FriendPost>> postHashMap;

    public FriendPost retrievePost(User user, Integer id) {
        FriendPost friendPost = postHashMap.get(user).get(id);
        return friendPost;
    }

    public void post(User user, String contents) {
        if(postHashMap.get(user) == null)
        {
            postHashMap.put(user, new ArrayList<FriendPost>());
            postHashMap.get(user).add(new FriendPost(0, contents, user));
            System.out.print("null");
        }
        else
        {
            postHashMap.get(user).add(new FriendPost(postHashMap.get(user).size(), contents, user));
            System.out.print("not null");
        }

    }

}

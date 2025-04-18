import React, { useState, useEffect, useRef } from "react";
import {View, Text, StyleSheet} from "react-native";
import Avatar from "@/components/Avatar";
import {AvatarStructure, Post} from "@/app/(tabs)/posts";
import {Button} from "react-native-paper";
import LikeApi from "@/api/PostLike";

type postBoxProps = {
    post: { id: number, posterId: number, content: string, postTime: string, imageURL: string};
    avatarLoading: boolean;
    avatarStructure: AvatarStructure;
    currentUserId: number;
};

export interface Like {
    id: number;
    postId: number;
    senderId: number;
    content: string;
}

export default function postBox({ post, avatarLoading, avatarStructure, currentUserId }: postBoxProps) {
    const date = new Date(post.postTime);
    const timeString = !isNaN(date.getTime())
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Invalid Date";
    const currentPostId = post.id;
    const [likes, setLikes] = useState<Like[]>([]);
    let count = 0;

    const handleLike = async () => {
        updatePostLikes();
        try{
            const newLike = await LikeApi.like({
                postId: currentPostId,
                senderId: currentUserId,
            });
            setLikes((prev) => [...prev, newLike]);
            count++;
        } catch (err) {
            console.error("Error liking:", err);
        }
    }

    const handleDislike = async () => {
        updatePostLikes();
        try{
            const newLike = await LikeApi.dislike({
                postId: currentPostId,
                senderId: currentUserId,
            });
            setLikes((prev) => [...prev, newLike]);
            count--;
        } catch (err) {
            console.error("Error disliking:", err);
        }
    }

    const updatePostLikes = async () => {
        const likeList = await LikeApi.retrieveLikes(currentPostId);
        setLikes(likeList);
        count = 0;
        for(const likes of likeList) {
            if(likes.content === "like") {
                count++
            }
            else if(likes.content === "dislike") {
                count--
            }
        }
    }

    return (
        <View style={[styles.postContainer]}>
            {!avatarLoading && <Avatar avatarUrl={avatarStructure.url} title={avatarStructure.username}/>}
            {/*{!avatarLoading && <Text>{avatarStructure.username}</Text>}*/}
            <View style={styles.post}>
                <Text style={styles.postText}>
                    {post.content}
                </Text>
                <Button mode="contained" onPress={handleLike} style={styles.button}>
                    Like
                </Button>
                <Text style={styles.postText}>
                    {count}
                </Text>
                <Button mode ="contained" onPress={handleDislike} style={styles.button}>
                    Dislike
                </Button>

                <Text style={styles.timestamp}>{timeString}</Text>

            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        marginVertical: 4,
        // paddingHorizontal: 10,
    },
    post: {
        maxWidth: "80%",
        paddingVertical: 10,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    button: {
        paddingVertical: 5,
        paddingHorizontal: 1
    },
    postText: {
        fontSize: 20,
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        marginTop: 4,
    },
});

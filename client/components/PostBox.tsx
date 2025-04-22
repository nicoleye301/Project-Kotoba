import React, { useState, useEffect, useRef } from "react";
import {View, TouchableOpacity, Text, StyleSheet} from "react-native";
import Avatar from "@/components/Avatar";
import {AvatarStructure, Post} from "@/app/(tabs)/posts";
import {Button} from "react-native-paper";
import LikeApi from "@/api/PostLike";
import {Link, router} from "expo-router";

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
    const [count, setCount] = useState(0);

    useEffect(() => {
        updatePostLikes();
    }, []);

    const handleLike = async () => {
        try{
            const newLike = await LikeApi.like({
                postId: currentPostId,
                senderId: currentUserId,
            });
            setLikes((prev) => [...prev, newLike]);
            updatePostLikes();

        } catch (err) {
            console.error("Error liking:", err);
        }
    }

    const handleDislike = async () => {
        try{
            const newLike = await LikeApi.dislike({
                postId: currentPostId,
                senderId: currentUserId,
            });
            setLikes((prev) => [...prev, newLike]);
            updatePostLikes();

        } catch (err) {
            console.error("Error disliking:", err);
        }
    }

    const updatePostLikes = async () => {
        const likeList = await LikeApi.retrieveLikes(currentPostId);
        setLikes(likeList);
        setCount(0);
        for(const likes of likeList) {
            if(likes.content === "like") {
                setCount(prevCount => prevCount + 1);
            }
            else if(likes.content === "dislike") {
                setCount(prevCount => prevCount - 1);
            }
        }
    }

    return (
        <View>
            <TouchableOpacity>
                <View>
                    {!avatarLoading && <Avatar avatarUrl={avatarStructure.url} title={avatarStructure.username}/>}
                </View>
            </TouchableOpacity>
            <View style={styles.post}>
                <Text style={styles.postText}>
                    {post.content}
                </Text>
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleLike} style={styles.button}>
                        Like
                    </Button>
                    <Text style={styles.postText}>
                        {count}
                    </Text>
                    <Button mode ="contained" onPress={handleDislike} style={styles.button}>
                        Dislike
                    </Button>
                </View>
                <Text style={styles.timestamp}>{timeString}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
    buttonContainer: {
        flexDirection: "row",
        padding: 10,
        borderColor: "#ddd",
        alignItems: "center",
    },

});

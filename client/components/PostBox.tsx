import React, { useState, useEffect, useRef } from "react";
import {View, TouchableOpacity, Text, StyleSheet, Image} from "react-native";
import Constants from "expo-constants";
import Avatar from "@/components/Avatar";
import {AvatarStructure} from "@/app/(tabs)/posts";
import {Button} from "react-native-paper";
import LikeApi from "@/api/PostLike";
import {Link, router} from "expo-router";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

type postBoxProps = {
    post: { id: number, posterId: number, content: string, postTime: string, imageURL: string};
    avatarStructure: AvatarStructure;
    currentUserId: number;
};

export interface Like {
    id: number;
    postId: number;
    senderId: number;
    content: string;
}

export default function postBox({ post, avatarStructure, currentUserId }: postBoxProps) {
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
            <View style={styles.post}>
                <TouchableOpacity onPress={() => {
                    router.push(`/UsersPosts?posterId=${post.posterId}&avatarURL=${encodeURIComponent(avatarStructure.url)}
                                &avatarUsername=${encodeURIComponent(avatarStructure.username)}`)
                }}>
                    <View style={styles.avatarContainer}>
                        <Avatar
                            avatarUrl={avatarStructure.url}
                            title={avatarStructure.username}
                        />
                        <Text style={styles.avatarText}>
                            {avatarStructure.username}
                        </Text>
                        <Text style={styles.timestamp}>
                            {timeString}
                        </Text>
                    </View>
                </TouchableOpacity>
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
    avatarText: {
        fontSize: 30,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 24,
        resizeMode: "cover",
    },
    avatarContainer: {
        flexDirection: "row",
        borderColor: "#ddd",
    },
    postText: {
        fontSize: 20,
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        textAlign: "right",
    },
    buttonContainer: {
        flexDirection: "row",
        padding: 10,
        borderColor: "#ddd",
        alignItems: "center",
    },

});

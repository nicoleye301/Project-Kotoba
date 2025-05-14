import {AvatarStructure} from "@/app/(tabs)/posts";
import {Dimensions, StyleSheet, Text, View} from "react-native";
import Avatar from "@/components/Avatar";
import React from "react";
import Constants from "expo-constants";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

type commentBoxProps = {
    comment: {id: number, postId: number, senderId: number, content: string, postTime: string;}
    avatarStructure: AvatarStructure;
};

export default function commentBox({ comment, avatarStructure}: commentBoxProps) {
    const date = new Date(comment.postTime);
    const timeString = !isNaN(date.getTime())
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Invalid Date";

    return (
        <View>
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
            <Text style={styles.commentText}>
                {comment.content}
            </Text>
    </View>
);
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    avatarText: {
        fontSize: 30,
    },
    avatarContainer: {
        flexDirection: "row",
        borderColor: "#ddd",
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        textAlign: "right",
    },
    commentText: {
        fontSize: 20,
    },
});

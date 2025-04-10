import React from "react";
import {View, Text, StyleSheet} from "react-native";
import Avatar from "@/components/Avatar";
import {AvatarStructure} from "@/app/(tabs)/posts";
import {Button} from "react-native-paper";

type postBoxProps = {
    post: { content: string, postTime: string};
    avatarLoading: boolean;
    avatarStructure: AvatarStructure;
};

export default function postBox({ post, avatarLoading, avatarStructure }: postBoxProps) {
    const date = new Date(post.postTime);
    const timeString = !isNaN(date.getTime())
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Invalid Date";

    return (
        <View style={[styles.postContainer]}>
            {!avatarLoading && <Avatar avatarUrl={avatarStructure.url} title={avatarStructure.username}/>}
            {/*{!avatarLoading && <Text>{avatarStructure.username}</Text>}*/}
            <View style={styles.post}>
                <Text style={styles.postText}>
                    {post.content}
                </Text>
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

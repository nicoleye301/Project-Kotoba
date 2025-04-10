import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import {Appbar, Text, List, Divider, Snackbar, ActivityIndicator,} from "react-native-paper";
import { useLocalSearchParams, router, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import UserApi from "@/api/user";
import Constants from "expo-constants";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function FriendDetailsScreen() {
    const params = useLocalSearchParams();
    const friendId = Number(params.friendId);

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [friend, setFriend] = useState<any>(null);
    const [nickname, setNickname] = useState("");
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");
    const [friendship, setFriendship] = useState<any>(null);

    useFocusEffect(
        useCallback(() => {
            AsyncStorage.getItem("loggedInUserId").then((id) => {
                if (id) {
                    const uid = Number(id);
                    setCurrentUserId(uid);
                    loadFriendProfile(uid);
                }
            });
        }, [friendId])
    );

    const loadFriendProfile = async (uid: number) => {
        try {
            const data = await FriendApi.getFriendProfile(uid, friendId);
            console.log("Friendship data:", data);
            setFriendship(data);
            const user = await UserApi.getUserById(friendId);
            setFriend(user);
            setNickname(data.nickname || "");
        } catch (err) {
            console.error("Error loading friend profile", err);
            Alert.alert("Error", "Failed to load friend details.");
        }
    };


    const handleChangeNickname = () => {
        router.push(`/ChangeNickname?friendId=${friendId}&nickname=${encodeURIComponent(nickname)}`);
    };

    const handleSetMilestone = () => {
        router.push(`/SetMilestone?friendId=${friendId}&friendName=${encodeURIComponent(friend?.username || "")}`);
    };

    const handleMessage = () => {
        if (!friendship?.directChatGroupId) {
            Alert.alert("Chat not available", "You don't have a chat group with this friend.");
            return;
        }
        router.push(
            `/conversation?chatId=${friendship.directChatGroupId}&isGroup=false&title=${encodeURIComponent(nickname || friend?.username)}`
        );
    };

    if (!friend) {
        return <ActivityIndicator style={{ marginTop: 50 }} />;
    }

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Friend Profile" />
            </Appbar.Header>

            <View style={styles.profileSection}>
                <Image
                    source={{ uri: `${BASE_URL}/uploads/avatar/${friend.avatar || "default.jpg"}` }}
                    style={styles.avatar}
                />
                <Text variant="titleMedium" style={styles.username}>
                    {friend.username}
                </Text>
                <Text variant="bodySmall" style={{ color: "#777" }}>
                    {nickname ? `"${nickname}"` : "No nickname set"}
                </Text>
            </View>

            <Divider />

            <List.Section>
                <List.Item
                    title="Send a Message"
                    left={() => <List.Icon icon="message-text" />}
                    onPress={handleMessage}
                />
                <List.Item
                    title="Set Milestone"
                    left={() => <List.Icon icon="target" />}
                    onPress={handleSetMilestone}
                />
                <List.Item
                    title="Change Nickname"
                    left={() => <List.Icon icon="account-edit" />}
                    onPress={handleChangeNickname}
                />
            </List.Section>

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={3000}
            >
                {snackbarMsg}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FBFF",
    },
    profileSection: {
        alignItems: "center",
        padding: 20,
        backgroundColor: "white",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 12,
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
    },
});

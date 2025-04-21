import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Alert } from "react-native";
import { Text, ActivityIndicator, Divider, List, Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import UserApi from "@/api/user";
import Constants from "expo-constants";
import { router } from "expo-router";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

interface Props {
    chatId: number; // directChatGroupId
}

const FriendProfileCard = ({ chatId }: Props) => {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [friendId, setFriendId] = useState<number | null>(null);
    const [friend, setFriend] = useState<any>(null);
    const [nickname, setNickname] = useState("");
    const [friendship, setFriendship] = useState<any>(null);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId").then((id) => {
            if (id) {
                const uid = Number(id);
                setCurrentUserId(uid);
                resolveFriendFromChat(uid, chatId);
            }
        });
    }, [chatId]);

    const resolveFriendFromChat = async (userId: number, chatId: number) => {
        try {
            const friends = await FriendApi.getFriendList(userId);
            const match = friends.find((f: any) => f.directChatGroupId === chatId);
            if (!match) throw new Error("Friendship not found for this chatId");

            const fid = match.userId === userId ? match.friendId : match.userId;
            setFriendId(fid);
            setFriendship(match);

            const user = await UserApi.getUserById(fid);
            setFriend(user);
            setNickname(match.nickname || "");
        } catch (err) {
            console.error("Error resolving friend info from chatId:", err);
            Alert.alert("Error", "Unable to load friend info.");
        }
    };

    const handleSetMilestone = () => {
        router.push(`/SetMilestone?friendId=${friend?.id}&friendName=${encodeURIComponent(friend?.username || "")}`);
    };

    const handleChangeNickname = () => {
        router.push(`/ChangeNickname?friendId=${friend?.id}&nickname=${encodeURIComponent(nickname || "")}`);
    };

    if (!friend) {
        return <ActivityIndicator style={{ margin: 16 }} />;
    }

    return (
        <View style={styles.card}>
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
                <List.Item title="Set Milestone" left={() => <List.Icon icon="target" />} onPress={handleSetMilestone} />
                <List.Item title="Change Nickname" left={() => <List.Icon icon="account-edit" />} onPress={handleChangeNickname} />
            </List.Section>

            <Snackbar visible={snackbarVisible} onDismiss={() => setSnackbarVisible(false)} duration={3000}>
                {snackbarMsg}
            </Snackbar>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        margin: 10,
    },
    profileSection: {
        alignItems: "center",
        paddingBottom: 20,
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

export default FriendProfileCard;

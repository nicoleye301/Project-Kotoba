import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, TextInput, Button, ActivityIndicator } from "react-native-paper";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import UserApi from "@/api/user";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

interface Props {
    friendId: number;
}

const FriendProfileCard = ({ friendId }: Props) => {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [friend, setFriend] = useState<any>(null);
    const [nickname, setNickname] = useState("");
    const [milestoneSettings, setMilestoneSettings] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId").then((id) => {
            if (id) {
                const uid = Number(id);
                setCurrentUserId(uid);
                loadProfile(uid);
            }
        });
    }, [friendId]);

    const loadProfile = async (userId: number) => {
        try {
            const data = await FriendApi.getFriendProfile(userId, friendId);
            const user = await UserApi.getUserById(friendId);
            setFriend(user);
            setNickname(data.nickname || "");
            setMilestoneSettings(data.milestoneSettings || "");
        } catch (err) {
            console.error("Error loading profile:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveNickname = async () => {
        if (!currentUserId) return;
        try {
            await FriendApi.setNickname({ userId: currentUserId, friendId, nickname });
        } catch (err) {
            console.error("Error saving nickname:", err);
        }
    };

    const handleSaveMilestone = async () => {
        if (!currentUserId) return;
        try {
            await FriendApi.setMilestone({ currentUserId, friendId, milestoneSettings });
        } catch (err) {
            console.error("Error saving milestone:", err);
        }
    };

    if (loading || !friend) {
        return <ActivityIndicator style={{ margin: 16 }} />;
    }

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <Image
                    source={{ uri: `${BASE_URL}/uploads/avatar/${friend.avatar || "default.jpg"}` }}
                    style={styles.avatar}
                />
                <View>
                    <Text variant="titleMedium">{friend.username}</Text>
                    <Text variant="bodySmall" style={{ color: "#777" }}>
                        {friend.email}
                    </Text>
                </View>
            </View>

            <Text style={styles.label}>Nickname</Text>
            <TextInput
                mode="outlined"
                value={nickname}
                onChangeText={setNickname}
                placeholder="Your nickname for this friend"
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSaveNickname} style={styles.button}>
                Save Nickname
            </Button>

            <Text style={styles.label}>Milestone Settings (JSON)</Text>
            <TextInput
                mode="outlined"
                value={milestoneSettings}
                onChangeText={setMilestoneSettings}
                multiline
                numberOfLines={6}
                style={styles.textarea}
            />
            <Button mode="contained" onPress={handleSaveMilestone} style={styles.button}>
                Save Milestone
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        margin: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 16,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 12,
    },
    label: {
        marginTop: 12,
        marginBottom: 4,
        fontWeight: "bold",
    },
    input: {
        marginBottom: 12,
    },
    textarea: {
        height: 120,
        marginBottom: 12,
    },
    button: {
        marginBottom: 16,
    },
});

export default FriendProfileCard;

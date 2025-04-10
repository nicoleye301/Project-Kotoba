import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {Appbar, TextInput, Button, Snackbar, Text, ActivityIndicator,} from "react-native-paper";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";

export default function ChangeNicknameScreen() {
    const { friendId, nickname } = useLocalSearchParams();
    const friendIdStr = Array.isArray(friendId) ? friendId[0] : friendId;
    const nicknameStr = Array.isArray(nickname) ? nickname[0] : nickname;
    const [newNickname, setNewNickname] = useState(decodeURIComponent(nicknameStr || ""));
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [snackbarMsg, setSnackbarMsg] = useState("");

    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId").then((id) => {
            if (id) setUserId(id);
        });
    }, []);

    const handleSave = async () => {
        if (!userId) return;

        setLoading(true);
        try {
            await FriendApi.setNickname({
                userId: Number(userId),
                friendId: Number(friendId),
                nickname: newNickname.trim(),
            });
            setSnackbarMsg("Nickname updated!");
            setSnackbarVisible(true);
            setTimeout(() => {
                router.back();
            }, 1000);
        } catch (err) {
            console.error("Error updating nickname:", err);
            setSnackbarMsg("Failed to update nickname.");
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title="Change Nickname" />
            </Appbar.Header>

            <View style={styles.content}>
                <Text style={styles.label}>Enter a new nickname:</Text>
                <TextInput
                    mode="outlined"
                    value={newNickname}
                    onChangeText={(text) => setNewNickname(text.slice(0, 30))}
                    placeholder="Nickname"
                    style={styles.input}
                />
                <Text style={styles.charCount}>{newNickname.length}/30</Text>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={loading}
                    disabled={newNickname.trim() === ""}
                    style={styles.button}
                >
                    Save
                </Button>
            </View>

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
    container: { flex: 1, backgroundColor: "#F9FBFF" },
    content: { padding: 20 },
    label: { fontSize: 16, marginBottom: 8 },
    input: { marginBottom: 8 },
    charCount: { textAlign: "right", color: "#888", marginBottom: 16 },
    button: { marginTop: 16 },
});

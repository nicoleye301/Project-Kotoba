import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";

const SendFriendRequest: React.FC = () => {
    const [friendUsername, setFriendUsername] = useState<string>("");

    const handleSend = async () => {
        const currentUserIdStr = await AsyncStorage.getItem("loggedInUserId");
        if (!currentUserIdStr) {
            Alert.alert("Error", "Please log in first.");
            return;
        }
        const currentUserId = Number(currentUserIdStr);
        try {
            await FriendApi.sendFriendRequest({ userId: currentUserId, friendUsername });
            Alert.alert("Success", "Friend request sent!");
            setFriendUsername("");
        } catch (error: any) {
            console.error("Error sending friend request:", error);
            Alert.alert("Error", error.message || "Failed to send friend request");
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Friend's Username"
                mode="outlined"
                value={friendUsername}
                onChangeText={setFriendUsername}
                style={styles.input}
            />
            <Button mode="contained" onPress={handleSend} style={styles.button}>
                Send Friend Request
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        marginBottom: 12,
    },
    button: {
        alignSelf: "center",
    },
});

export default SendFriendRequest;

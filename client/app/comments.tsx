import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    Dimensions, Text,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import PostBox from "@/components/PostBox";
import {router} from "expo-router";
import React, {useState} from "react";

export interface Post {
    id: number;
    posterId: number;
    content: string;
    postTime: string;
    imageURL?: string;
}

export interface Comment {
    id: number;
    postId: number;
    senderId: number;
    content: string;
    postTime: string;
}

export type AvatarStructure = {
    url: string;
    username: string;
}

export default function comments() {

    const [inputText, setInputText] = useState("");

    const handleComment = async ()=> {

    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View>
                <Button mode="contained" onPress={() => router.back()} style={styles.sendButton}>
                    back
                </Button>
                <TextInput
                    mode="outlined"
                    placeholder="Type your comment..."
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handleComment} style={styles.sendButton}>
                    Send
                </Button>

            </View>
        </KeyboardAvoidingView>


)
}
const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
        overflowY: "scroll",
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "600",
        color: "#000",
    },
    postContainer: { padding: 12, paddingBottom: 20 },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    buttonContainer: {
        display: "flex"
    },
    input: { flex: 1, marginRight: 10 },
    sendButton: { paddingVertical: 6, paddingHorizontal: 12 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingIndicator: { marginTop: 20 },
    messageText: {
        fontSize: 16,
        color: "#333",
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        alignSelf: "flex-end",
        marginTop: 4,
    },
});

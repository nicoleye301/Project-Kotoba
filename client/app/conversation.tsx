import React, { useState, useEffect, useRef } from "react";
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import ChatBubble from "@/components/ChatBubble";
import ChatApi from "@/api/message";
import eventEmitter from "@/utils/eventEmitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";

type Message = {
    id: number;
    senderId: number;
    chatId: number;
    content: string;
    sentTime: string;
    status?: string;
    attachments?: {};
};

export default function ConversationScreen() {
    const params = useSearchParams();
    const chatIdParam = params.get("chatId");
    const chatId = chatIdParam ? Number(chatIdParam) : null;

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId")
            .then((storedId) => {
                if (storedId) {
                    setCurrentUserId(Number(storedId));
                }
            })
            .catch((err) => console.error("Error retrieving user ID:", err));
    }, []);

    useEffect(() => {
        if (!chatId) return;
        setLoading(true);
        ChatApi.fetchHistory(chatId)
            .then((history: Message[]) => {
                setMessages(history);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            })
            .catch((err) => console.error("Error fetching history:", err))
            .finally(() => setLoading(false));
    }, [chatId]);

    useEffect(() => {
        const listener = eventEmitter.addListener("message", (data: string) => {
            try {
                const newMessage: Message = JSON.parse(data);
                if (newMessage.chatId === chatId) {
                    setMessages((prev) => [...prev, newMessage]);
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            } catch (err) {
                console.error("Error parsing incoming message:", err);
            }
        });
        return () => listener.remove();
    }, [chatId]);

    const sendMessage = async () => {
        if (!inputText.trim() || !currentUserId || !chatId) return;
        try {
            const newMessage: Message = await ChatApi.sendMessage({
                senderId: currentUserId,
                groupId: chatId,
                content: inputText,
            });
            setMessages((prev) => [...prev, newMessage]);
            setInputText("");
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <ChatBubble
            message={item}
            isOwn={currentUserId !== null && item.senderId === currentUserId}
        />
    );

    if (!chatId) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.conversationHeader}>
                <Button mode="text" onPress={undefined} style={styles.headerBackButton}>
                    &lt;
                </Button>
                <Button mode="text" onPress={undefined} style={styles.headerInfoButton}>
                    Chat Name
                </Button>
            </View>
            {loading ? (
                <ActivityIndicator size="large" color="#333" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) =>
                        item.id ? item.id.toString() : Math.random().toString()
                    }
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesContainer}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                />
            )}
            <View style={styles.inputContainer}>
                <TextInput
                    mode="outlined"
                    placeholder="Type your message..."
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                />
                <Button mode="contained" onPress={sendMessage} style={styles.sendButton}>
                    Send
                </Button>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    messagesContainer: { padding: 12, paddingBottom: 20 },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    conversationHeader: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    input: { flex: 1, marginRight: 10 },
    sendButton: { paddingVertical: 6, paddingHorizontal: 12 },
    headerBackButton: { paddingVertical: 3, paddingHorizontal: 3 },
    headerInfoButton: { paddingVertical: 6, paddingHorizontal : 6},
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingIndicator: { marginTop: 20 },
});

import React, { useState, useEffect, useRef } from "react";
import {
    View,
    FlatList,
    TextInput,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import ChatBubble from "@/components/ChatBubble";
import ChatApi, { Message } from "@/api/message";
import eventEmitter from "@/utils/eventEmitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";

export default function ConversationScreen() {
    const params = useSearchParams();
    const chatIdParam = params.get("chatId");
    const chatId = chatIdParam ? Number(chatIdParam) : 0;

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        // get current user ID from AsyncStorage
        AsyncStorage.getItem("loggedInUserId").then((storedId) => {
            if (storedId) {
                setCurrentUserId(Number(storedId));
            }
        });
    }, []);

    useEffect(() => {
        // only fetch if chatId is valid (non-zero)
        if (!chatId) return;
        ChatApi.fetchHistory(chatId)
            .then((history: Message[]) => {
                setMessages(history);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            })
            .catch((err) => console.error("Error fetching history:", err));
    }, [chatId]);

    useEffect(() => {
        // listen for incoming messages via WebSocket
        const listener = eventEmitter.addListener("message", (data: string) => {
            try {
                const newMessage: Message = JSON.parse(data);
                if (newMessage.chatId === chatId) {
                    setMessages((prev) => [...prev, newMessage]);
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            } catch (err) {
                console.error("Error parsing message:", err);
            }
        });
        return () => listener.remove();
    }, [chatId]);

    const sendMessage = async () => {
        if (!inputText.trim() || !currentUserId) return;
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item, index) =>
                    item.id ? item.id.toString() : index.toString()
                }
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesContainer}
                onContentSizeChange={() =>
                    flatListRef.current?.scrollToEnd({ animated: true })
                }
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type your message..."
                />
                <Button title="Send" onPress={sendMessage} />
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F9FBFF" },
    messagesContainer: { padding: 10 },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
    },
    input: {
        flex: 1,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginRight: 10,
    },
});

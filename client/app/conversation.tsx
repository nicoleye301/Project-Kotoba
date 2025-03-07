import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import ChatBubble from "@/components/ChatBubble";
import ChatApi from "@/api/message";
import eventEmitter from "@/utils/eventEmitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSearchParams} from "expo-router/build/hooks";

type Message = {
    id: number;
    senderId: number;
    conversationId: number;
    content: string;
    timestamp: string;
    isGroup: boolean;
};

export default function ConversationScreen() {
    const searchParams = useSearchParams();
    const conversationId = Number(searchParams.get("id"));
    const isGroupChat = searchParams.get("isGroup") === "true";
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const flatListRef = useRef<FlatList<Message>>(null);

    useEffect(() => {
        // retrieve the current user's id from AsyncStorage
        AsyncStorage.getItem("loggedInUserId").then((storedId) => {
            if (storedId) {
                setCurrentUserId(Number(storedId));
            }
        });
    }, []);

    useEffect(() => {
        // fetch conversation history
        ChatApi.fetchHistory({ conversationId, isGroup: isGroupChat })
            .then((history) => {
                setMessages(history);
            })
            .catch((error) => {
                console.error("Error fetching history:", error);
            });
    }, [conversationId, isGroupChat]);

    useEffect(() => {
        // listen for incoming messages
        const listener = eventEmitter.addListener("message", (data: string) => {
            try {
                const newMessage: Message = JSON.parse(data);
                if (
                    (isGroupChat && newMessage.isGroup && newMessage.conversationId === conversationId) ||
                    (!isGroupChat && !newMessage.isGroup && newMessage.conversationId === conversationId)
                ) {
                    setMessages((prev) => [...prev, newMessage]);
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            } catch (error) {
                console.error("Error parsing message:", error);
            }
        });
        return () => listener.remove();
    }, [conversationId, isGroupChat]);

    const sendMessage = async () => {
        if (inputText.trim() === "") return;
        try {
            const newMessage = await ChatApi.sendMessage({
                message: inputText,
                conversationId,
            });
            setMessages((prev) => [...prev, newMessage]);
            setInputText("");
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (error) {
            console.error("Error sending message:", error);
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
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messagesContainer}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
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

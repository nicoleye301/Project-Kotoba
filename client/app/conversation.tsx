import React, { useState, useEffect, useRef } from "react";
import {View, FlatList, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Text, TouchableOpacity,} from "react-native";
import { TextInput, Button, Appbar, Menu, Portal } from "react-native-paper";
import ChatBubble from "@/components/ChatBubble";
import ChatApi from "@/api/message";
import ChatGroupApi from "@/api/ChatGroup";
import eventEmitter from "@/utils/eventEmitter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
import SuggestedReplies from "@/components/SuggestedReplies";
import NlpApi from "@/api/nlp";
import * as Clipboard from "expo-clipboard";
import FriendProfileCard from "@/components/FriendProfileCard";
import { Modal as PaperModal } from 'react-native-paper';
import Modal from 'react-native-modal';

type Message = {
    id: number;
    senderId: number;
    chatId: number;
    content: string;
    sentTime: string;  // "2025-03-21T07:24:32.306" from server
    status?: string;
};

export type AvatarStructure = {
    url: string;
    username: string;
};

export default function ConversationScreen() {
    const params = useSearchParams();
    const chatIdParam = params.get("chatId");
    const chatId = chatIdParam ? Number(chatIdParam) : null;

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [avatars, setAvatars] = useState<Record<string, AvatarStructure>>({});
    const flatListRef = useRef<FlatList<Message>>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);

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
                // convert IDs to numbers so "own" check works
                const mappedHistory = history.map((msg) => ({
                    ...msg,
                    id: Number(msg.id),
                    senderId: Number(msg.senderId),
                    chatId: Number(msg.chatId),
                }));
                setMessages(mappedHistory);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            })
            .catch((err) => console.error("Error fetching history:", err))
            .finally(() => setLoading(false));
    }, [chatId]);

    // listen for incoming messages via WebSocket
    useEffect(() => {
        const listener = eventEmitter.addListener("message", (data: string) => {
            try {
                const serverMsg = JSON.parse(data);
                const newMessage: Message = {
                    id: Number(serverMsg.id),
                    senderId: Number(serverMsg.senderId),
                    chatId: Number(serverMsg.groupId),
                    content: serverMsg.content,
                    sentTime: serverMsg.timestamp,
                    status: serverMsg.status,
                };

                // ignore broadcasted messages sent by ourselves, prob will change to optimistic update
                if (currentUserId !== null && newMessage.senderId === currentUserId) {
                    return;
                }

                if (newMessage.chatId === chatId) {
                    setMessages((prev) => {
                        // deduplicate by ID
                        if (prev.some((m) => m.id === newMessage.id)) {
                            return prev;
                        }
                        return [...prev, newMessage];
                    });
                    flatListRef.current?.scrollToEnd({ animated: true });
                }
            } catch (err) {
                console.error("Error parsing incoming message:", err);
            }
        });
        return () => listener.remove();
    }, [chatId, currentUserId]);

    useEffect(() => {
        if(chatId){
            setAvatarLoading(true)
            ChatGroupApi.getAvatars(chatId).then(
                ((avatars)=>{
                    setAvatars(avatars)
                })
            ).finally(()=>{
                setAvatarLoading(false)
            })
        }
    }, [chatId]);

    // send a message via API
    const sendMessage = async () => {
        if (!inputText.trim() || !currentUserId || !chatId) return;
        try {
            const newMessage: Message = await ChatApi.sendMessage({
                senderId: currentUserId,
                groupId: chatId,
                content: inputText,
            });
            // convert IDs to numbers
            newMessage.id = Number(newMessage.id);
            newMessage.senderId = Number(newMessage.senderId);
            newMessage.chatId = Number(newMessage.chatId);
            setMessages((prev) => [...prev, newMessage]);
            setInputText("");
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const handleLongPress = (text: string) => {
        setSelectedMessage(text);
        setModalVisible(true);
    };

    const handleCopy = () => {
        if (selectedMessage) {
            Clipboard.setStringAsync(selectedMessage);
            setModalVisible(false);
        }
    };

    const handleAiReply = () => {
        if (selectedMessage) {
            NlpApi.getAiSuggestedReplies(selectedMessage)
                .then(setSuggestions)
                .catch(console.error);
            setModalVisible(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <ChatBubble
            message={item}
            isOwn={currentUserId !== null && item.senderId === currentUserId}
            avatarLoading={avatarLoading}
            avatarStructure={avatars[item.senderId.toString()]}
            onLongPress={() => handleLongPress(item.content)}
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
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={params.get("title")} />
                {params.get("isGroup") !== "true" && (
                    <Menu
                        visible={menuVisible}
                        onDismiss={() => setMenuVisible(false)}
                        anchor={
                            <Appbar.Action
                                icon="dots-vertical"
                                onPress={() => setMenuVisible(true)}
                            />
                        }
                    >
                        <Menu.Item
                            onPress={() => {
                                setMenuVisible(false);
                                setProfileVisible(true);
                            }}
                            title="View Friend Profile"
                        />
                    </Menu>
                )}
            </Appbar.Header>

            {loading ? (
                <ActivityIndicator size="large" color="#333" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.messagesContainer}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                />
            )}

            {suggestions.length > 0 && (
                <SuggestedReplies
                    suggestions={suggestions}
                    onSelect={(reply: string) => {
                        setInputText(reply);
                        setSuggestions([]);
                    }}
                />
            )}

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={() => setModalVisible(false)}
                animationIn="fadeInUp"
                animationOut="fadeOutDown"
                backdropOpacity={0.3}
                style={{ justifyContent: "flex-end", margin: 0 }}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity onPress={handleCopy}>
                        <Text style={styles.modalOption}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleAiReply}>
                        <Text style={styles.modalOption}>Suggest a Response</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={[styles.modalOption, { color: "#FF4C4C" }]}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            <Portal>
                <PaperModal
                    visible={profileVisible}
                    onDismiss={() => setProfileVisible(false)}
                    contentContainerStyle={{
                        backgroundColor: "white",
                        margin: 20,
                        borderRadius: 12,
                        padding: 16,
                    }}
                >
                    {chatId && <FriendProfileCard chatId={chatId} />}
                </PaperModal>
            </Portal>

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
    input: { flex: 1, marginRight: 10 },
    sendButton: { paddingVertical: 6, paddingHorizontal: 12 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    loadingIndicator: { marginTop: 20 },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    modalOption: {
        fontSize: 18,
        paddingVertical: 12,
        textAlign: "center",
        borderBottomWidth: 1,
        borderColor: "#eee",
    },
});

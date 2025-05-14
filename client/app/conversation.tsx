import React, { useState, useEffect, useRef } from "react";
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    Text,
    TouchableOpacity,
    Pressable,
    ScrollView, Dimensions
} from "react-native";
import {
    TextInput,
    Appbar,
    Menu,
    Portal,
    FAB,
    Modal as PaperModal
} from "react-native-paper";

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
import Modal from "react-native-modal";
import pickImage from "@/utils/imagePicker";
import Avatar from "@/components/Avatar";
import ImageBubble from "@/components/ImageBubble";
import GameBubble from "@/components/GameBubble";
import { Tictactoe } from "@/api/tictactoe";
import { MotiView } from 'moti';
import message from "@/api/message";

type Message = {
    id: number;
    senderId: number;
    chatId: number;
    content: string;
    type: string;
    sentTime: string; // "2025-03-21T07:24:32.306" from server
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
    const [aiAnalysisVisible, setAiAnalysisVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [image, setImage] = useState<string | null>(null);
    const [analysisLines, setAnalysisLines] = useState<string[]>([]);
    const [analysisLoading, setAnalysisLoading] = useState(false);
    const [analysisError, setAnalysisError] = useState<string|null>(null);


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

    // Listen for incoming messages via WebSocket
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
                    type: serverMsg.type,
                };

                // Ignore broadcasted messages sent by ourselves
                if (currentUserId !== null && newMessage.senderId === currentUserId) {
                    return;
                }

                if (newMessage.chatId === chatId) {
                    setMessages((prev) => {
                        // Deduplicate by ID
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
        if (chatId) {
            setAvatarLoading(true);
            ChatGroupApi.getAvatars(chatId)
                .then((avatars) => {
                    setAvatars(avatars);
                })
                .finally(() => {
                    setAvatarLoading(false);
                });
        }
    }, [chatId]);

    // Send a message via API
    const sendMessage = async () => {
        if (!inputText.trim() || !currentUserId || !chatId) return;
        try {
            const newMessage: Message = await ChatApi.sendMessage({
                senderId: currentUserId,
                groupId: chatId,
                content: inputText,
                type: "plaintext",
            });
            addOwnMessage(newMessage);
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const addOwnMessage = (newMessage: Message) => {
        // Convert IDs to numbers
        newMessage.id = Number(newMessage.id);
        newMessage.senderId = Number(newMessage.senderId);
        newMessage.chatId = Number(newMessage.chatId);
        setMessages((prev) => [...prev, newMessage]);
        setInputText("");
        flatListRef.current?.scrollToEnd({ animated: true });
    };

    const playTictictoe = async (content: string, position: number) => {
        const ttt = Tictactoe.fromString(content);
        if (ttt.move(position, currentUserId)) {
            await sendMessageGame(ttt);
        }
    };

    // send a game message via API
    const sendMessageGame = async (ttt:Tictactoe=new Tictactoe(currentUserId)) => {
        if (!currentUserId || !chatId) return;
        try {
            const newMessage: Message = await ChatApi.sendMessage({
                senderId: currentUserId,
                groupId: chatId,
                content: ttt.toString(),
                type: "game",
            });
            // Convert IDs to numbers
            newMessage.id = Number(newMessage.id);
            newMessage.senderId = Number(newMessage.senderId);
            newMessage.chatId = Number(newMessage.chatId);
            setMessages((prev) => [...prev, newMessage]);
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (err) {
            console.error("Error sending game message:", err);
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

    const handleAiAnalysis = () => {
        setModalVisible(false);
        if (!selectedMessage) return;

        setAnalysisLoading(true);
        NlpApi.analyzeMessage(selectedMessage)
            .then(lines => setAnalysisLines(lines))
            .catch(err => {
                console.error(err);
                setAnalysisError(err.message);
            })
            .finally(() => setAnalysisLoading(false));

        setAiAnalysisVisible(true);
    };
    
    const renderMessage = ({ item }: { item: Message }) =>{
        const isOwn= (currentUserId !== null && item.senderId === currentUserId)
        const avatarStructure= avatars[item.senderId.toString()]
        let bubble = null
        if(item.type==='plaintext'){
            bubble = <ChatBubble message={item} isOwn={isOwn}/>
        }
        else if(item.type==='image'){
            bubble = <ImageBubble message={item}/>
        }
        else if(item.type==='game'){
            const ttt = Tictactoe.fromString(item.content);
            const winner = ttt.winner
            if(messages[messages.length-1]===item){
                if (winner===currentUserId){
                    alert('You win!')
                }
                else if(winner!== null){
                    alert('You lose!')
                }
            }

            bubble = <GameBubble message={item} isOwn={isOwn} callbackOnPress={playTictictoe}/>
        }

        return (
            <Pressable onLongPress={() => handleLongPress(item.content)}>
                <View
                    style={[
                        styles.bubbleContainer,
                        isOwn ? styles.rightAlign : styles.leftAlign,
                    ]}
                >
                    {!avatarLoading && (
                        <Avatar
                            avatarUrl={avatarStructure.url}
                            title={avatarStructure.username}
                        />
                    )}
                    {bubble}
                </View>
            </Pressable>
        );
    };

    const handleSendImage = async () => {
        const image = await pickImage()
        setImage(image)
        try{
            // upload avatar
            if(image){
                const formData = new FormData()
                formData.append('senderId', String(currentUserId))
                formData.append('chatId', String(chatId))
                // @ts-ignore
                formData.append("avatar", {
                    uri: image,
                    name: "image",
                    type: "image/jpeg",
                });
                const newMessage = await ChatApi.sendImage(formData);
                addOwnMessage(newMessage);
                setImage(null);
            }
        } catch (err) {
            alert("Error uploading image: " + err);
        }
        setShowAddMenu(!showAddMenu);
    };

    if (!chatId) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    return (
        <MotiView
            from={{ translateX: 300, opacity: 0 }}
            animate={{ translateX: 0,   opacity: 1 }}
            style={{ flex: 1 }}
        >
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
                <ActivityIndicator
                    size="large"
                    color="#333"
                    style={styles.loadingIndicator}
                />
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

            {/* long press options modal */}
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
                    <TouchableOpacity onPress={handleAiAnalysis}>
                        <Text style={styles.modalOption}>AI Analysis</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={[styles.modalOption, { color: "#FF4C4C" }]}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* AiAnalysis modal */}
            <Modal isVisible={aiAnalysisVisible} /*…*/>
                <View style={styles.modalContent}>
                    {analysisLoading && <ActivityIndicator />}
                    {analysisError && <Text style={{color:'red'}}>{analysisError}</Text>}
                    {!analysisLoading && !analysisError && analysisLines.map((l,i)=>
                        <Text key={i} style={analysisStyles.analysisText}>{l}</Text>
                    )}
                    <TouchableOpacity onPress={()=>setAiAnalysisVisible(false)}>
                        <Text style={[styles.modalOption,{color:'#FF4C4C',marginTop:10}]}>Close</Text>
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
                <FAB
                    icon="plus"
                    onPress={() => setShowAddMenu(!showAddMenu)}
                    style={{ marginRight: 10 }}
                />
                <FAB icon="send" onPress={sendMessage} />
            </View>
            {showAddMenu && (
                <View style={styles.addMenu}>
                    <FAB
                        icon="image"
                        onPress={handleSendImage}
                        style={styles.FAB}
                    />
                    <FAB
                        icon="gamepad-square"
                        onPress={() => sendMessageGame()}
                        style={styles.FAB}
                    />
                </View>
            )}
        </KeyboardAvoidingView>
        </MotiView>
    );
}

const screenHeight = Dimensions.get("window").height;

export const analysisStyles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#F5F5F5",
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 16,
    },
    contentContainer: {
        maxHeight: screenHeight * 0.55, // 55% of screen height — allows for larger scroll area
        paddingRight: 4,
    },
    analysisText: {
        fontSize: 16,
        lineHeight: 26,
        color: "#444",
        marginBottom: 14,
    },
    modalContent: {
        backgroundColor: "#fff",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        maxHeight: screenHeight * 0.75, // controls overall popup height
    },
});


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    messagesContainer: { padding: 12, paddingBottom: 20 },
    bubbleContainer: {
        marginVertical: 4,
    },
    leftAlign: {
        alignSelf: "flex-start",
        flexDirection: "row",
    },
    rightAlign: {
        alignSelf: "flex-end",
        flexDirection: "row-reverse",
    },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    addMenu: {
        flexDirection: "row",
        padding: 10,
        alignItems: "center",
        height: 90,
    },
    FAB: {
        marginLeft: 15,
        marginRight: 20,
        shadowColor: "transparent",
    },
    input: { flex: 1, marginRight: 10 },
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

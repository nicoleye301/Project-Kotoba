import React, { useState, useEffect } from "react";
import {View, FlatList, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Text, Dimensions,} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import UserApi from "@/api/user"
import {Appbar, PaperProvider} from "react-native-paper";

export interface ChatItem {
    type: "friend" | "group";
    id: number;
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    updatedAt?: string;
}

export default function ChatScreen() {
    const router = useRouter();
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [friendChats, setFriendChats] = useState<ChatItem[]>([]);
    const [groupChats, setGroupChats] = useState<ChatItem[]>([]);
    const [combinedChats, setCombinedChats] = useState<ChatItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId")
            .then((storedId) => {
                if (storedId) {
                    setCurrentUserId(Number(storedId));
                }
            })
            .catch((err) => console.error("Error retrieving user ID:", err));
    }, []);

    // fetch friend chats (accepted friendships)
    useEffect(() => {
        if (!currentUserId) return;
        setLoading(true);
        FriendApi.getFriendList(currentUserId)
            .then(async (friendships: any[]) => {
                // map each friendship to a ChatItem by fetching friend details
                const friendItems: ChatItem[] = await Promise.all(
                    friendships.map(async (f) => {
                        // determine the other friend’s ID
                        const friendId = f.userId === currentUserId ? f.friendId : f.userId;
                        try {
                            const friendUser = await UserApi.getUserById(friendId);
                            return {
                                type: "friend",
                                id: f.directChatGroupId || friendId,
                                title: friendUser.username,
                                subtitle: "Tap to chat",
                                updatedAt: f.updatedAt || "Just now",
                                avatarUrl: friendUser.avatar || "",
                            };
                        } catch (error) {
                            console.error(`Error fetching details for friend ID ${friendId}:`, error);
                            return {
                                type: "friend",
                                id: f.directChatGroupId || friendId,
                                title: `Friend #${friendId}`,
                                subtitle: "Tap to chat",
                                updatedAt: f.updatedAt || "Just now",
                                avatarUrl: "",
                            };
                        }
                    })
                );
                setFriendChats(friendItems);
            })
            .catch((err) => {
                console.error("Error fetching friend chats:", err);
                Alert.alert("Error", "Failed to fetch friend chats.");
            })
            .finally(() => setLoading(false));

        // placeholder for group chats – replace with GroupApi
        const mockGroupItems: ChatItem[] = [
            {
                type: "group",
                id: 101,
                title: "Family Group",
                subtitle: "Mock",
                updatedAt: "Yesterday",
                avatarUrl: "",
            },
            {
                type: "group",
                id: 102,
                title: "Work Chat",
                subtitle: "Project discussion: Mock",
                updatedAt: "2 days ago",
                avatarUrl: "",
            },
        ];
        setGroupChats(mockGroupItems);
    }, [currentUserId]);

    useEffect(() => {
        setCombinedChats([...friendChats, ...groupChats]);
    }, [friendChats, groupChats]);

    const renderChatItem = ({ item }: { item: ChatItem }) => (
        <TouchableOpacity
            style={styles.chatCard}
            onPress={() => {
                if (item.type === "friend") {
                    router.push(
                        `/conversation?chatId=${item.id}&isGroup=false&title=${encodeURIComponent(item.title)}`
                    );
                } else {
                    router.push(
                        `/conversation?chatId=${item.id}&isGroup=true&title=${encodeURIComponent(item.title)}`
                    );
                }
            }}
        >
            <View style={styles.avatarContainer}>
                {item.avatarUrl ? (
                    <Image source={{ uri: item.avatarUrl }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, styles.avatarPlaceholder]}>
                        <Text style={styles.avatarInitial}>
                            {item.title ? item.title[0] : "?"}
                        </Text>
                    </View>
                )}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.chatTitle} numberOfLines={1}>
                    {item.title}
                </Text>
                <Text style={styles.chatSubtitle} numberOfLines={1}>
                    {item.subtitle}
                </Text>
            </View>
            <View style={styles.timeContainer}>
                <Text style={styles.chatTime}>{item.updatedAt}</Text>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#333" />
            </View>
        );
    }

    return (
        <View style={{flex:1}}>
            <Appbar.Header>
                <Appbar.Content title="Chats" />
            </Appbar.Header>
            <PaperProvider>
                <FlatList
                    data={combinedChats}
                    keyExtractor={(item) => `${item.type}-${item.id}`}
                    renderItem={renderChatItem}
                    contentContainerStyle={styles.listContainer}
                    style={{backgroundColor: 'white'}}
                />
            </PaperProvider>
        </View>
    );
}

const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    chatCard: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginVertical: 5,
        borderRadius: 12,
        padding: 12,
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        resizeMode: "cover",
    },
    avatarPlaceholder: {
        backgroundColor: "#bbb",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarInitial: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
    textContainer: {
        flex: 1,
        justifyContent: "center",
    },
    chatTitle: {
        color: "#000",
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 4,
    },
    chatSubtitle: {
        color: "#555",
        fontSize: 14,
    },
    timeContainer: {
        marginLeft: 8,
        justifyContent: "center",
    },
    chatTime: {
        color: "#999",
        fontSize: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

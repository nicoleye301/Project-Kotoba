import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import {Appbar, TextInput, Button, Card, Title, Paragraph, Provider, Portal, Modal, List, PaperProvider, Searchbar, IconButton} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import UserApi from "@/api/user";
import SendFriendRequest from "@/components/SendFriendRequest";
import { LightTheme } from '@/theme/theme';
import eventEmitter from "@/utils/eventEmitter";

// define the Friendship type
interface Friendship {
    id: number;
    userId: number;       // the sender of the friend request
    friendId: number;     // the receiver (the other user)
    nickname?: string;
    directChatGroupId?: number;
    status: string;      // "pending", "accepted", "declined", etc.
}

// define ChatItem type for displaying confirmed friends in the UI
interface ChatItem {
    type: "friend" | "group";
    id: number;
    title: string;
    subtitle?: string;
    avatarUrl?: string;
    updatedAt?: string;
}

export default function ContactsScreen() {
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [pendingRequests, setPendingRequests] = useState<Friendship[]>([]);
    const [confirmedFriends, setConfirmedFriends] = useState<ChatItem[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    // retrieve current user's ID from AsyncStorage
    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId")
            .then((storedId) => {
                if (storedId) {
                    setCurrentUserId(Number(storedId));
                }
            })
            .catch((error) => console.error("Error retrieving user ID:", error));
    }, []);

    // fetch pending friend requests (where the current user is the receiver)
    useEffect(() => {
        if (currentUserId !== null) {
            FriendApi.getPendingRequests(currentUserId)
                .then((data: Friendship[]) => {
                    setPendingRequests(data);
                })
                .catch((error) => {
                    console.error("Error fetching pending requests:", error);
                    Alert.alert("Error", "Failed to fetch pending friend requests.");
                });
        }
    }, [currentUserId]);

    useEffect(() => {
        const friendListListener = eventEmitter.addListener("friendListUpdated", () => {
            // call function to refresh the friend list
            refreshRequestsAndFriends();
        });
        return () => friendListListener.remove();
    }, []);


    // fetch accepted friends and map them to ChatItem objects
    useEffect(() => {
        if (currentUserId !== null) {
            FriendApi.getFriendList(currentUserId)
                .then(async (friendships: Friendship[]) => {
                    // use a dictionary to remove duplicates
                    const friendItemsMap: { [key: number]: ChatItem } = {};
                    await Promise.all(
                        friendships.map(async (f: Friendship) => {
                            // determine the other
                            const friendId = f.userId === currentUserId ? f.friendId : f.userId;
                            if (!friendItemsMap[friendId]) {
                                try {
                                    const friendUser = await UserApi.getUserById(friendId);
                                    friendItemsMap[friendId] = {
                                        type: "friend",
                                        id: friendId,
                                        title: friendUser.username,
                                        subtitle: "Tap to chat",
                                        updatedAt: "Just now", // update with a proper timestamp later
                                        avatarUrl: friendUser.avatar || "",
                                    };
                                } catch (error) {
                                    console.error(`Error fetching details for friend ID ${friendId}:`, error);
                                    friendItemsMap[friendId] = {
                                        type: "friend",
                                        id: friendId,
                                        title: `Friend #${friendId}`,
                                        subtitle: "Tap to chat",
                                        updatedAt: "Just now",
                                        avatarUrl: "",
                                    };
                                }
                            }
                        })
                    );
                    setConfirmedFriends(Object.values(friendItemsMap));
                })
                .catch((error) => {
                    console.error("Error fetching friend list:", error);
                    Alert.alert("Error", "Failed to fetch friend list.");
                });
        }
    }, [currentUserId]);

    // refresh both pending and accepted friend lists
    const refreshRequestsAndFriends = async () => {
        if (currentUserId !== null) {
            try {
                const pendingData: Friendship[] = await FriendApi.getPendingRequests(currentUserId);
                setPendingRequests(pendingData);
                const friendData: Friendship[] = await FriendApi.getFriendList(currentUserId);
                const friendItemsMap: { [key: number]: ChatItem } = {};
                await Promise.all(
                    friendData.map(async (f: Friendship) => {
                        const friendId = f.userId === currentUserId ? f.friendId : f.userId;
                        if (!friendItemsMap[friendId]) {
                            try {
                                const friendUser = await UserApi.getUserById(friendId);
                                friendItemsMap[friendId] = {
                                    type: "friend",
                                    id: friendId,
                                    title: friendUser.username,
                                    subtitle: "Tap to chat",
                                    updatedAt: "Just now",
                                    avatarUrl: friendUser.avatar || "",
                                };
                            } catch (error) {
                                console.error(`Error fetching details for friend ID ${friendId}:`, error);
                                friendItemsMap[friendId] = {
                                    type: "friend",
                                    id: friendId,
                                    title: `Friend #${friendId}`,
                                    subtitle: "Tap to chat",
                                    updatedAt: "Just now",
                                    avatarUrl: "",
                                };
                            }
                        }
                    })
                );
                setConfirmedFriends(Object.values(friendItemsMap));
            } catch (error) {
                console.error("Error refreshing friend lists:", error);
            }
        }
    };

    // when accepting or declining a friend request, pass the friendship record's id
    const handleAccept = async (friendship: Friendship) => {
        if (!currentUserId) return;
        try {
            await FriendApi.acceptFriendRequest({ id: friendship.id });
            refreshRequestsAndFriends();
        } catch (error: any) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleDecline = async (friendship: Friendship) => {
        if (!currentUserId) return;
        try {
            await FriendApi.declineFriendRequest({ id: friendship.id });
            refreshRequestsAndFriends();
        } catch (error: any) {
            console.error("Error declining friend request:", error);
        }
    };

    const renderPendingItem = ({ item }: { item: Friendship }) => (
        <List.Item
            title={`Request from user #${item.userId}`}
            description={`Status: ${item.status}`}
            left={() => <List.Icon icon="account-clock" />}
            right={() => (
                <View style={styles.requestActions}>
                    <Button mode="contained" style={styles.actionBtn} onPress={() => handleAccept(item)}>
                        Accept
                    </Button>
                    <Button mode="outlined" style={[styles.actionBtn, { marginLeft: 8 }]} onPress={() => handleDecline(item)}>
                        Decline
                    </Button>
                </View>
            )}
            style={styles.pendingListItem}
        />
    );

    const renderFriendItem = ({ item }: { item: ChatItem }) => (
        <List.Item
            title={item.title}
            description={item.subtitle}
            left={() => <List.Icon icon="account" />}
            right={() => <List.Icon icon="chevron-right" />}
            style={styles.friendListItem}
        />
    );

    // ----- UI -----
    return (
        <PaperProvider theme={LightTheme}>
            <Appbar.Header>
                <Appbar.Content title="Contacts" />
                <Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
            </Appbar.Header>

            <View style={styles.container}>
                <Searchbar
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchbar}
                />
                {/* Pending requests */}
                {pendingRequests.length > 0 && (
                    <>
                        <Text style={styles.sectionTitle}>Pending Requests</Text>
                        <FlatList
                            data={pendingRequests}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderPendingItem}
                            style={styles.flatListSpacing}
                        />
                    </>
                )}
                {/* Friends */}
                <Text style={styles.sectionTitle}>Friends</Text>
                <FlatList
                    data={confirmedFriends}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFriendItem}
                    style={styles.flatListSpacing}
                />
                {/* Modal for adding friend */}
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        {/* Close icon in top-right */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Friend</Text>
                            <IconButton
                                icon="close"
                                onPress={() => setModalVisible(false)}
                                style={styles.closeIcon}
                            />
                        </View>
                        <SendFriendRequest onClose={() => setModalVisible(false)} />
                        <Button
                            mode="contained"
                            onPress={() => setModalVisible(false)}
                            style={styles.modalCloseBtn}
                        >
                            Close
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
    );
}

// ----- STYLES -----
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FBFF",
    },
    searchbar: {
        margin: 16,
        borderRadius: 12,
    },
    sectionTitle: {
        marginLeft: 16,
        marginBottom: 4,
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    flatListSpacing: {
        marginHorizontal: 8,
        marginBottom: 16,
    },
    // pending requests
    pendingListItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginVertical: 4,
        elevation: 1,
    },
    requestActions: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 8,
    },
    actionBtn: {
        minWidth: 72,
    },
    // friend list
    friendListItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginVertical: 4,
        elevation: 1,
    },
    // modal
    modalContainer: {
        backgroundColor: "white",
        padding: 20,
        marginHorizontal: 16,
        borderRadius: 12,
    },
    modalHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    closeIcon: {
        margin: 0,
    },
    modalCloseBtn: {
        marginTop: 16,
    },
});
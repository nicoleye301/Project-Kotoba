import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, StyleSheet, Alert, Text } from "react-native";
import {Appbar, Searchbar, IconButton, Portal, Modal, List, PaperProvider, Button,} from "react-native-paper";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import UserApi from "@/api/user";
import SendFriendRequest from "@/components/SendFriendRequest";
import { LightTheme } from "@/theme/theme";
import eventEmitter from "@/utils/eventEmitter";
import { getDisplayName } from "@/utils/displayName";
import { useFocusEffect } from "expo-router";

// define the Friendship type
interface Friendship {
    id: number;
    userId: number;       // the sender of the friend request
    friendId: number;     // the receiver (the other user)
    nickname?: string;
    directChatGroupId?: number;
    status: string;       // "pending", "accepted", "declined", etc.
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
    useFocusEffect(
        useCallback(() => {
            const loadUserId = async () => {
                const storedId = await AsyncStorage.getItem("loggedInUserId");
                if (storedId) {
                    setCurrentUserId(Number(storedId));
                }
            };
            loadUserId();
        }, [])
    );

    // refresh data on screen focus
    useFocusEffect(
        useCallback(() => {
            if (currentUserId !== null) {
                refreshRequestsAndFriends();
            }
        }, [currentUserId])
    );

    const refreshRequestsAndFriends = async () => {
        if (currentUserId === null) return;
        try {
            const [pendingData, friendData] = await Promise.all([
                FriendApi.getPendingRequests(currentUserId),
                FriendApi.getFriendList(currentUserId),
            ]);
            setPendingRequests(pendingData);

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
                                title: getDisplayName({ username: friendUser.username }, f.nickname),
                                subtitle: "Set milestone",
                                updatedAt: "Just now",
                                avatarUrl: friendUser.avatar || "",
                            };
                        } catch (error) {
                            console.error(`Error fetching details for friend ID ${friendId}:`, error);
                            friendItemsMap[friendId] = {
                                type: "friend",
                                id: friendId,
                                title: `Friend #${friendId}`,
                                subtitle: "Set milestone",
                                updatedAt: "Just now",
                                avatarUrl: "",
                            };
                        }
                    }
                })
            );
            setConfirmedFriends(Object.values(friendItemsMap));
        } catch (error) {
            console.error("Error refreshing friend data:", error);
        }
    };

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

    // when a friend item is pressed, navigate to the milestone setup screen
    const renderFriendItem = ({ item }: { item: ChatItem }) => (
        <List.Item
            title={item.title}
            description={item.subtitle}
            left={() => <List.Icon icon="account" />}
            right={() => <List.Icon icon="chevron-right" />}
            onPress={() =>
                router.push(`/FriendDetails?friendId=${item.id}`)
            }
            style={styles.friendListItem}
        />
    );

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
                <Text style={styles.sectionTitle}>Friends</Text>
                <FlatList
                    data={confirmedFriends}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFriendItem}
                    style={styles.flatListSpacing}
                />
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modalContainer}
                    >
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Friend</Text>
                            <IconButton
                                icon="close"
                                onPress={() => setModalVisible(false)}
                                style={styles.closeIcon}
                            />
                        </View>
                        <SendFriendRequest onClose={() => setModalVisible(false)} />
                        <Button mode="contained" onPress={() => setModalVisible(false)} style={styles.modalCloseBtn}>
                            Close
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </PaperProvider>
    );
}

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
    friendListItem: {
        backgroundColor: "#fff",
        borderRadius: 8,
        marginVertical: 4,
        elevation: 1,
    },
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

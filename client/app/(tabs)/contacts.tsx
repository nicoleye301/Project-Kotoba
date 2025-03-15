import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Alert, Text } from "react-native";
import {
    Appbar,
    TextInput,
    Button,
    Card,
    Title,
    Paragraph,
    Modal,
    Portal,
    Provider,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import SendFriendRequest from "@/components/SendFriendRequest";

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
    id: number;       // for friends, this is the "other" user's id
    title: string;    // friend name
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
            .catch((error) =>
                console.error("Error retrieving user ID:", error)
            );
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

    // fetch accepted friends and map them to ChatItem objects
    useEffect(() => {
        if (currentUserId !== null) {
            FriendApi.getFriendList(currentUserId)
                .then((friendships: Friendship[]) => {
                    const friendItems: ChatItem[] = friendships.map((f: Friendship): ChatItem => {
                        // Determine the "other" user:
                        const friendId = f.userId === currentUserId ? f.friendId : f.userId;
                        return {
                            type: "friend",
                            id: friendId,
                            title: `Friend #${friendId}`,
                            subtitle: "Tap to chat",
                            updatedAt: "Just now", // replace with a real timestamp
                            avatarUrl: "",
                        };
                    });
                    setConfirmedFriends(friendItems);
                })
                .catch((error) => {
                    console.error("Error fetching friend list:", error);
                    Alert.alert("Error", "Failed to fetch friend list.");
                });
        }
    }, [currentUserId]);

    const handleAccept = async (friendship: Friendship) => {
        if (!currentUserId) return;
        try {
            await FriendApi.acceptFriendRequest({
                id:friendship.id
            });
            refreshRequestsAndFriends();
        } catch (error: any) {
            console.error("Error accepting friend request:", error);
        }
    };

    const handleDecline = async (friendship: Friendship) => {
        if (!currentUserId) return;
        try {
            await FriendApi.declineFriendRequest({
                id:friendship.id
            });
            refreshRequestsAndFriends();
        } catch (error: any) {
            console.error("Error declining friend request:", error);
        }
    };

    const refreshRequestsAndFriends = async () => {
        if (currentUserId !== null) {
            try {
                const pendingData: Friendship[] = await FriendApi.getPendingRequests(currentUserId);
                setPendingRequests(pendingData);
                const friendData: Friendship[] = await FriendApi.getFriendList(currentUserId);
                const friendItems: ChatItem[] = friendData.map((f: Friendship): ChatItem => {
                    const friendId = f.userId === currentUserId ? f.friendId : f.userId;
                    return {
                        type: "friend",
                        id: friendId,
                        title: `Friend #${friendId}`,
                        subtitle: "Tap to chat",
                        updatedAt: "Just now",
                        avatarUrl: "",
                    };
                });
                setConfirmedFriends(friendItems);
            } catch (error) {
                console.error("Error refreshing friend lists:", error);
            }
        }
    };

    const renderPendingItem = ({ item }: { item: Friendship }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>Friend Request from User ID: {item.userId}</Title>
                <Paragraph>Status: {item.status}</Paragraph>
            </Card.Content>
            <Card.Actions>
                <Button onPress={() => handleAccept(item)}>Accept</Button>
                <Button onPress={() => handleDecline(item)}>Decline</Button>
            </Card.Actions>
        </Card>
    );

    const renderFriendItem = ({ item }: { item: ChatItem }) => (
        <Card style={styles.card}>
            <Card.Content>
                <Title>Friend ID: {item.id}</Title>
                <Paragraph>{item.subtitle}</Paragraph>
            </Card.Content>
        </Card>
    );

    return (
        <Provider>
            <View style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title="Contacts" />
                    <Appbar.Action icon="plus" onPress={() => setModalVisible(true)} />
                </Appbar.Header>
                <TextInput
                    label="Search"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchBar}
                />
                {pendingRequests.length > 0 && (
                    <View>
                        <Title style={styles.sectionTitle}>Pending Requests</Title>
                        <FlatList
                            data={pendingRequests}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderPendingItem}
                        />
                    </View>
                )}
                <Title style={styles.sectionTitle}>Friends</Title>
                <FlatList
                    data={confirmedFriends}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderFriendItem}
                />
                <Portal>
                    <Modal
                        visible={modalVisible}
                        onDismiss={() => setModalVisible(false)}
                        contentContainerStyle={styles.modal}
                    >
                        <SendFriendRequest />
                        <Button
                            mode="contained"
                            onPress={() => setModalVisible(false)}
                            style={styles.modalButton}
                        >
                            Close
                        </Button>
                    </Modal>
                </Portal>
            </View>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FBFF",
    },
    searchBar: {
        margin: 10,
    },
    sectionTitle: {
        marginLeft: 10,
        marginTop: 10,
    },
    card: {
        marginHorizontal: 10,
        marginVertical: 5,
    },
    modal: {
        backgroundColor: "white",
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    modalButton: {
        marginTop: 10,
    },
});

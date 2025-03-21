import React, { useState, useEffect } from "react";
import {
    View,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Text,
} from "react-native";
import {
    TextInput,
    Button,
    Checkbox,
    IconButton,
    useTheme,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createGroup, CreateGroupParams, ChatGroup } from "@/api/ChatGroup";
import { getFriendList } from "@/api/friend";

interface Friend {
    id: number;
    username: string;
    avatar?: string;
}

type CreateGroupChatProps = {
    onClose: (newGroup?: ChatGroup) => void;
};

const CreateGroupChat: React.FC<CreateGroupChatProps> = ({ onClose }) => {
    const theme = useTheme();
    const [groupName, setGroupName] = useState("");
    const [friends, setFriends] = useState<Friend[]>([]);
    const [selectedFriendIds, setSelectedFriendIds] = useState<number[]>([]);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const storedId = await AsyncStorage.getItem("loggedInUserId");
                if (!storedId) return;
                const userId = Number(storedId);
                setCurrentUserId(userId);

                // fetch accepted friends
                const friendships: any[] = await getFriendList(userId);
                const friendList = friendships.map((f) => {
                    const friendId = f.userId === userId ? f.friendId : f.userId;
                    return {
                        id: friendId,
                        username: `Friend #${friendId}`,
                    } as Friend;
                });
                setFriends(friendList);
            } catch (err) {
                console.error("Error loading friends:", err);
                Alert.alert("Error", "Failed to load friend list.");
            }
        })();
    }, []);

    const toggleFriendSelection = (friendId: number) => {
        if (selectedFriendIds.includes(friendId)) {
            setSelectedFriendIds((prev) => prev.filter((id) => id !== friendId));
        } else {
            setSelectedFriendIds((prev) => [...prev, friendId]);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert("Validation", "Please enter a group name.");
            return;
        }
        if (selectedFriendIds.length === 0) {
            Alert.alert("Validation", "Please select at least one friend.");
            return;
        }
        if (currentUserId === null) return;

        const params: CreateGroupParams = {
            ownerId: currentUserId,
            groupName: groupName,
            memberIds: selectedFriendIds,
        };

        setLoading(true);
        try {
            const groupChat = await createGroup(params);
            Alert.alert("Success", `Group chat created: ${groupChat.groupName}`);
            // pass the new group chat back to the parent
            onClose(groupChat);
        } catch (err: any) {
            console.error("Error creating group chat:", err);
            Alert.alert("Error", err.message || "Failed to create group chat");
        } finally {
            setLoading(false);
        }
    };

    const renderFriendItem = ({ item }: { item: Friend }) => (
        <TouchableOpacity
            style={styles.friendItem}
            onPress={() => toggleFriendSelection(item.id)}
        >
            <Checkbox
                status={selectedFriendIds.includes(item.id) ? "checked" : "unchecked"}
                onPress={() => toggleFriendSelection(item.id)}
                color={theme.colors.primary}
            />
            <Text style={styles.friendName}>{item.username}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.modalContainer}>
            <View style={styles.headerRow}>
                <Text style={styles.headerTitle}>Create Group Chat</Text>
                <IconButton icon="close" onPress={() => onClose()} />
            </View>
            <TextInput
                mode="outlined"
                label="Group Name"
                value={groupName}
                onChangeText={setGroupName}
                style={styles.input}
            />
            <Text style={styles.sectionTitle}>Select Friends</Text>
            <View style={styles.friendListContainer}>
                {friends.length === 0 ? (
                    <Text style={{ color: "#999" }}>No friends found.</Text>
                ) : (
                    <FlatList
                        data={friends}
                        keyExtractor={(f) => f.id.toString()}
                        renderItem={renderFriendItem}
                    />
                )}
            </View>
            <Button
                mode="contained"
                onPress={handleCreateGroup}
                style={styles.createButton}
                disabled={loading}
            >
                {loading ? "Creating..." : "Create Group Chat"}
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: "#FFF",
        padding: 20,
        margin: 20,
        borderRadius: 12,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "600",
    },
    input: {
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "500",
        marginBottom: 8,
    },
    friendListContainer: {
        maxHeight: 200,
        marginBottom: 16,
    },
    friendItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 6,
    },
    friendName: {
        marginLeft: 8,
        fontSize: 15,
    },
    createButton: {
        marginTop: 8,
        borderRadius: 8,
    },
});

export default CreateGroupChat;

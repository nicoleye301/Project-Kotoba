import React, { useState, useEffect, useRef } from "react";
import {
    View,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    ActivityIndicator,
    Dimensions, Text,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import ChatBubble from "@/components/ChatBubble";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, router} from "expo-router";
import PostApi from "@/api/post"
import FriendApi from "@/api/friend";
import UserApi from "@/api/user";

export interface Post {
    id: number;
    posterId: number;
    content: string;
    postTime: string;
    imageURL?: string;
    posterUsername?: string;
}

export default function posts(){

    const [postContents, setPostContents] = useState("")
    const [currentUserId, setCurrentUserId] = useState<number>(-1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef<FlatList<Post>>(null);


    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId")
            .then((storedId) => {
                if (storedId) {
                    setCurrentUserId(Number(storedId));
                }
            })
            .catch((err) => console.error("Error retrieving user ID:", err));
    }, []);

    const handlePost = async () => {
        if (!inputText.trim() || !currentUserId) return;
        try{
            const newPost: Post = await PostApi.post({
                posterId: currentUserId,
                content: inputText,
            });
            setPosts((prev) => [...prev, newPost]);
            setInputText("");
            flatListRef.current?.scrollToEnd({ animated: true });
        } catch (err) {
            console.error("Error posting:", err);
        }
    }

    const handleRetrieveFriendPost = async () => {
        setLoading(true);
        PostApi.retrievePost(currentUserId)
            .then((history: Post[]) => {
                setPosts(history);
                setTimeout(() => {
                    flatListRef.current?.scrollToEnd({ animated: true });
                }, 100);
            })

        const friendList = await FriendApi.getFriendList(currentUserId);
        for(const friends of friendList) {
            const friendsPost: Post[] = await PostApi.retrievePost(friends.friendId)
            setPosts((prev) => [...prev, ...friendsPost]);

            /*console.log("check before");
            for(const user of friendsPost) {
                console.log("check during");
                user.posterUsername = (await UserApi.getUserById(user.posterId)).username;
            }
            console.log("check after");*/

        }

        setLoading(false);
    }

    const renderPost = ({ item }: { item: Post }) => (

        <View>
            <Text style={styles.messageText}>{item.posterUsername}</Text>
            <Text style={styles.messageText}>{item.content}</Text>
            <Text style={styles.timestamp}>
                {new Date(item.postTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
        </View>

    )

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={styles.inputContainer}>
                <TextInput
                    mode="outlined"
                    placeholder="Type your post..."
                    value={inputText}
                    onChangeText={setInputText}
                    style={styles.input}
                />
                <Button mode="contained" onPress={handlePost} style={styles.sendButton}>
                    Send
                </Button>
            </View>
            <Button mode="contained" onPress={handleRetrieveFriendPost} style={styles.sendButton}>
                Refresh Posts
            </Button>

            {loading ? (
                <ActivityIndicator size="large" color="#333" style={styles.loadingIndicator} />
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={posts}
                    keyExtractor={(item) =>
                        item.id ? item.id.toString() : Math.random().toString()
                    }
                    renderItem={renderPost}
                    contentContainerStyle={styles.postContainer}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: true })
                    }
                />
                )}
                </KeyboardAvoidingView>
    )


};


const { width } = Dimensions.get("window");
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 40,
    },
    headerContainer: {
        paddingHorizontal: 20,
        marginBottom: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "600",
        color: "#000",
    },
    postContainer: { padding: 12, paddingBottom: 20 },
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
            messageText: {
            fontSize: 16,
            color: "#333",
        },
            timestamp: {
            fontSize: 10,
            color: "#555",
            alignSelf: "flex-end",
            marginTop: 4,
        },

        });

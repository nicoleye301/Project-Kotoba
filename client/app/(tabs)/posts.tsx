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
import PostBox from "@/components/PostBox";
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
}

export type AvatarStructure = {
    url: string;
    username: string;
}

export default function posts() {

    const [currentUserId, setCurrentUserId] = useState<number>(-1);
    const [posts, setPosts] = useState<Post[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [avatars, setAvatars] = useState<Record<string, AvatarStructure>>({});
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

    useEffect(() => {
        async function getAvatars() {
            if(currentUserId)
            {
                const friendList = await FriendApi.getFriendList(currentUserId);
                const friendIdArray = []
                friendIdArray.push(currentUserId);
                for(const friends of friendList) {
                    friendIdArray.push(friends.friendId);
                }

                PostApi.getAvatar(friendIdArray).then(
                    ((avatars) =>{
                        setAvatars(avatars)
                    })
                ).finally(() =>{
                        setAvatarLoading(false)
                    })

            }
        }
        getAvatars();

    }, [currentUserId]);

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
            const friendsPost: Post[] = await PostApi.retrievePost(friends.friendId);
            setPosts((prev) => [...prev, ...friendsPost]);
        }
        setLoading(false);
    }

    const handleLike = async ()=> {

    }

    const renderPost = ({ item }: { item: Post }) => {
        return (
            <View>
                <PostBox
                    post={item}
                    avatarLoading={avatarLoading}
                    avatarStructure={avatars[22]}
                />
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={handleLike} style={styles.sendButton}>
                        Like
                    </Button>

                    <Button mode="contained" onPress={()=> {
                        router.push(
                            `/comments?postId=${item.id}&posterId=${item.posterId}&content=${encodeURIComponent(item.content)}&postTime=${encodeURIComponent(item.postTime)}`
                        )
                    }} style={styles.sendButton}>
                        Comment
                    </Button>
                </View>

            </View>
        )
    };

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
                    keyExtractor={(item) => item.id.toString()}
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
        overflowY: "scroll",
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
    buttonContainer: {
        display: "flex"
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

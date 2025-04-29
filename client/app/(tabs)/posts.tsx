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
import {TextInput, Button, Appbar} from "react-native-paper";
import PostBox from "@/components/PostBox";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, router} from "expo-router";
import PostApi from "@/api/post"
import FriendApi from "@/api/friend";
import pickImage from "@/utils/imagePicker";

export interface Post {
    id: number;
    posterId: number;
    content: string;
    postTime: string;
    imageURL: string;
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
    const [image, setImage] = useState<string|null>(null);

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
        if(currentUserId != -1)
        {
            handleRetrieveFriendPost();
        }
    }, [currentUserId]);

    const getAvatars = async () => {
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

    const handlePost = async () => {
        if (!inputText.trim() || !currentUserId) return;
        try{
            const newPost: Post = await PostApi.post({
                posterId: currentUserId,
                content: inputText,
            });
            setPosts((prev) => [...prev, newPost]);
            setInputText("");
        } catch (err) {
            console.error("Error posting:", err);
        }
    }

    const handleRetrieveFriendPost = async () => {
        setLoading(true);
        const currentUserPosts: Post[] = await PostApi.retrievePost(currentUserId)
        const friendList = await FriendApi.getFriendList(currentUserId);

        let postList = [...currentUserPosts];
        for(const friends of friendList) {
            const friendsPost: Post[] = await PostApi.retrievePost(friends.friendId);
            postList = postList.concat(friendsPost);
        }

        await getAvatars();
        const sortedPostList = [...postList].sort((a, b) => (new Date(a.postTime) > new Date(b.postTime)) ? -1 : ((new Date(b.postTime) > new Date(a.postTime)) ? 1 : 0))
        setPosts(sortedPostList);
        setLoading(false);
    }

    const handlePickImage = async () => {
        //await pickImage(setImage)
    }


    const renderPost = ({ item }: { item: Post }) => {
        return (
            <View style={styles.postContainer}>
                <PostBox
                    post={item}
                    avatarLoading={avatarLoading}
                    avatarStructure={avatars[item.posterId.toString()]}
                    currentUserId={currentUserId}
                />
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={()=> {
                        router.push(
                            `/comments?postId=${item.id}&posterId=${item.posterId}&content=${encodeURIComponent(item.content)}
                            &postTime=${encodeURIComponent(item.postTime)}&imageURL=${encodeURIComponent(item.imageURL)}
                            &avatarURL=${encodeURIComponent(avatars[item.posterId.toString()].url)}
                            &avatarUsername=${encodeURIComponent(avatars[item.posterId.toString()].username)}`
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
            <Appbar.Header>
                <Appbar.Content title="Posts" />
            </Appbar.Header>

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
                    contentContainerStyle={styles.screenContainer}
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
    screenContainer: { padding: 12, paddingBottom: 20 },
    inputContainer: {
        flexDirection: "row",
        padding: 10,
        borderTopWidth: 1,
        borderColor: "#ddd",
        alignItems: "center",
    },
    postContainer: {
        marginVertical: 4,
        borderTopWidth: 5,
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

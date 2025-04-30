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
import {router} from "expo-router";
import React, {useEffect, useRef, useState} from "react";
import FriendApi from "@/api/friend";
import PostApi from "@/api/post";
import CommentApi from "@/api/PostComment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSearchParams} from "expo-router/build/hooks";

export interface Post {
    id: number;
    posterId: number;
    content: string;
    postTime: string;
    imageURL: string;
}

export interface Comment {
    id: number;
    postId: number;
    senderId: number;
    content: string;
    postTime: string;
}

export type AvatarStructure = {
    url: string;
    username: string;
}

export default function comments() {
    const params = useSearchParams();
    const currentPost: Post = {
        id: parseInt(params.get("postId")!),
        posterId: parseInt(params.get("posterId")!),
        content: params.get("content")!,
        postTime: params.get("postTime")!,
        imageURL: params.get("imageURL")!
    }
    const postAvatar: AvatarStructure = {
        url: params.get("avatarURL")!,
        username: params.get("avatarUsername")!
    }

    const [currentUserId, setCurrentUserId] = useState<number>(-1);
    const [comments, setComments] = useState<Comment[]>([]);
    const [inputText, setInputText] = useState("");
    const [loading, setLoading] = useState(true);
    const [avatarLoading, setAvatarLoading] = useState(true);
    const [avatars, setAvatars] = useState<Record<string, AvatarStructure>>({});
    const flatListRef = useRef<FlatList<Comment>>(null);

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
        handleRetrieveComment();
    }, []);

    async function getAvatars() {
        const friendList = await FriendApi.getFriendList(currentPost.posterId);
        const friendIdArray = []
        friendIdArray.push(currentPost.posterId);
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

    const handleComment = async ()=> {
        if (!inputText.trim() || !currentUserId) return;
        try {
            const newComment: Comment = await CommentApi.comment({
                postId: currentPost.id,
                senderId: currentUserId,
                content: inputText,
            });
            setComments((prev) =>[...prev, newComment]);
            setInputText("");
        } catch (err) {
            console.error("Error commenting:", err);
        }

    }

    const handleRetrieveComment = async ()=> {
        getAvatars();
        setLoading(true);
        CommentApi.retrieveComment(currentPost.id)
            .then((history: Comment[]) => {
                setComments(history);
            });
        setLoading(false);
    }

    const renderComment = ({ item }: { item: Comment}) => {
        return (
            <View>
                <Text style={styles.commentText}>
                    {item.content}
                </Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <Appbar.Header>
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={"Back To Posts"} />
            </Appbar.Header>

            <View>
                <View>
                    <PostBox
                        post={currentPost}
                        avatarLoading={avatarLoading}
                        avatarStructure={postAvatar}
                        currentUserId={currentUserId}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        mode="outlined"
                        placeholder="Type your post..."
                        value={inputText}
                        onChangeText={setInputText}
                        style={styles.input}
                    />
                    <Button mode="contained" onPress={handleComment} style={styles.sendButton}>
                        Send
                    </Button>
                </View>
                <Button mode="contained" onPress={handleRetrieveComment} style={styles.sendButton}>
                    Refresh comments
                </Button>

                {loading ? (
                    <ActivityIndicator size="large" color="#333" style={styles.loadingIndicator} />
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={comments}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderComment}
                        contentContainerStyle={styles.postContainer}
                    />
                )}

            </View>
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
    commentText: {
        fontSize: 15,
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        alignSelf: "flex-end",
        marginTop: 4,
    },
});

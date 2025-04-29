import PostApi from "@/api/post";
import FriendApi from "@/api/friend";
import {ActivityIndicator, Dimensions, FlatList, KeyboardAvoidingView, Platform, StyleSheet, View} from "react-native";
import PostBox from "@/components/PostBox";
import {Appbar, Button, TextInput} from "react-native-paper";
import {router} from "expo-router";
import React, {useEffect, useRef, useState} from "react";
import {AvatarStructure, Post} from "@/app/(tabs)/posts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useSearchParams} from "expo-router/build/hooks";

export default function UsersPosts() {
    const params = useSearchParams();
    const posterId: number = parseInt(params.get("posterId")!);
    const postAvatar: AvatarStructure = {
        url: params.get("avatarURL")!,
        username: params.get("avatarUsername")!
    }

    const [currentUserId, setCurrentUserId] = useState<number>(-1);
    const [posts, setPosts] = useState<Post[]>([]);
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

    useEffect(() => {
        if(currentUserId != -1)
        {
            handleRetrieveFriendPost();
        }
    }, [currentUserId]);

    const handleRetrieveFriendPost = async () => {
        setLoading(true);
        const userPosts: Post[] = await PostApi.retrievePost(posterId)

        const sortedPostList = [...userPosts].sort((a, b) => (new Date(a.postTime) > new Date(b.postTime)) ? -1 : ((new Date(b.postTime) > new Date(a.postTime)) ? 1 : 0))
        setPosts(sortedPostList);

        setLoading(false);
    }


    const renderPost = ({ item }: { item: Post }) => {
        return (
            <View style={styles.postContainer}>
                <PostBox
                    post={item}
                    avatarLoading={false}
                    avatarStructure={postAvatar}
                    currentUserId={currentUserId}
                />
                <View style={styles.buttonContainer}>
                    <Button mode="contained" onPress={()=> {
                        router.push(
                            `/comments?postId=${item.id}&posterId=${item.posterId}&content=${encodeURIComponent(item.content)}
                            &postTime=${encodeURIComponent(item.postTime)}&imageURL=${encodeURIComponent(item.imageURL)}
                            &avatarURL=${encodeURIComponent(postAvatar.url)}
                            &avatarUsername=${encodeURIComponent(postAvatar.username)}`
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
                <Appbar.BackAction onPress={() => router.back()} />
                <Appbar.Content title={"Back To Posts"} />
            </Appbar.Header>

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
import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

type Conversation = {
    id: number;
    title: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    isGroup: boolean;
};

export default function ChatListScreen() {
    const [selectedTab, setSelectedTab] = useState<"personal" | "group">("personal");
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const router = useRouter();

    useEffect(() => {
        // placeholder for UI testing
        if (selectedTab === "personal") {
            setConversations([
                { id: 1, title: "Alice", lastMessage: "Hey, how are you?", timestamp: new Date().toISOString(), unreadCount: 2, isGroup: false },
                { id: 2, title: "Bob", lastMessage: "Let's meet tomorrow.", timestamp: new Date().toISOString(), unreadCount: 0, isGroup: false },
            ]);
        } else {
            setConversations([
                { id: 101, title: "Family Group", lastMessage: "Dinner at 7?", timestamp: new Date().toISOString(), unreadCount: 3, isGroup: true },
                { id: 102, title: "Work Chat", lastMessage: "Deadline extended!", timestamp: new Date().toISOString(), unreadCount: 0, isGroup: true },
            ]);
        }
    }, [selectedTab]);

    const renderConversation = ({ item }: { item: Conversation }) => (
        <TouchableOpacity
            style={styles.conversationCard}
            onPress={() =>
                // pass parameters (conversation id, type, and title) to the Conversation screen
                router.push(`/conversation?id=${item.id}&isGroup=${item.isGroup}&title=${encodeURIComponent(item.title)}`)
            }
        >
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMessage}>{item.lastMessage}</Text>
            </View>
            {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Tab Toggle */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    onPress={() => setSelectedTab("personal")}
                    style={[styles.tabButton, selectedTab === "personal" && styles.activeTab]}
                >
                    <Text style={[styles.tabText, selectedTab === "personal" && styles.activeTabText]}>Personal</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedTab("group")}
                    style={[styles.tabButton, selectedTab === "group" && styles.activeTab]}
                >
                    <Text style={[styles.tabText, selectedTab === "group" && styles.activeTabText]}>Group</Text>
                </TouchableOpacity>
            </View>
            {/* Conversation List */}
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderConversation}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: "#F9FBFF" },
    tabContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 10 },
    tabButton: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: "#E1E0E0", marginHorizontal: 5 },
    activeTab: { backgroundColor: "#4C9BFF" },
    tabText: { fontSize: 16, color: "#333" },
    activeTabText: { color: "#fff" },
    listContainer: { paddingBottom: 20 },
    conversationCard: { flexDirection: "row", alignItems: "center", padding: 10, borderBottomWidth: 1, borderColor: "#ccc" },
    cardContent: { flex: 1 },
    cardTitle: { fontSize: 16, fontWeight: "bold" },
    cardMessage: { fontSize: 14, color: "#666", marginTop: 4 },
    unreadBadge: { backgroundColor: "#4C9BFF", borderRadius: 12, paddingHorizontal: 6, paddingVertical: 2 },
    unreadText: { color: "#fff", fontSize: 12 },
});

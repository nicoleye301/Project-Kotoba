import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ChatBubbleProps = {
    message: { content: string; sentTime: string };
    isOwn: boolean;
};

export default function ChatBubble({ message, isOwn }: ChatBubbleProps) {
    return (
        <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}>
            <Text style={styles.messageText}>{message.content}</Text>
            <Text style={styles.timestamp}>
                {new Date(message.sentTime).toLocaleTimeString()}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: { padding: 10, borderRadius: 8, marginVertical: 4, maxWidth: "80%" },
    ownBubble: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
    otherBubble: { alignSelf: "flex-start", backgroundColor: "#FFF" },
    messageText: { fontSize: 16 },
    timestamp: { fontSize: 10, textAlign: "right", marginTop: 4 },
});

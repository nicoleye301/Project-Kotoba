import React from "react";
import { View, Text, StyleSheet } from "react-native";

type ChatBubbleProps = {
    message: { content: string; sentTime: string};
    isOwn: boolean;
};

export default function ChatBubble({ message, isOwn}: ChatBubbleProps) {
    const date = new Date(message.sentTime);
    const timeString = !isNaN(date.getTime())
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Invalid Date";

    return (
        <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.friendBubble]}>
            <Text style={[styles.messageText, isOwn ? styles.ownText : styles.friendText]}>
                {message.content}
            </Text>
            <Text style={styles.timestamp}>{timeString}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: "80%",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ownBubble: {
        backgroundColor: "#DCF8C6",
        borderTopRightRadius: 0,
    },
    friendBubble: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 16,
    },
    ownText: {
        textAlign: "right",
        color: "#000",
    },
    friendText: {
        textAlign: "left",
        color: "#333",
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        alignSelf: "flex-end",
        marginTop: 4,
    },
});

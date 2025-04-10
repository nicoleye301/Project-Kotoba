import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface SuggestedRepliesProps {
    suggestions: string[];
    onSelect: (reply: string) => void;
}

const isValidSuggestion = (text: string) => {
    return (
        text.trim() !== "" &&
        !/^okay[,:\s]+here are/i.test(text.trim()) // filters preamble
    );
};

const SuggestedReplies: React.FC<SuggestedRepliesProps> = ({ suggestions, onSelect }) => {
    const parsedSuggestions = suggestions
        .flatMap((s) => s.split(/\n+/)) // split on all newlines regardless of format
        .map((s) => s.trim())
        .filter(isValidSuggestion);

    return (
        <View style={styles.container}>
            {parsedSuggestions.map((reply, index) => (
                <TouchableOpacity
                    key={index}
                    style={styles.replyBubble}
                    onPress={() => onSelect(reply)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.replyText}>{reply}</Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginHorizontal: 12,
        marginVertical: 10,
        gap: 8,
    },
    replyBubble: {
        backgroundColor: "#e6f3e9",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },
    replyText: {
        fontSize: 14,
        color: "#2e7d32",
    },
});

export default SuggestedReplies;

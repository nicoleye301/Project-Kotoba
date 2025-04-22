import React from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import {analysisStyles} from "@/app/conversation";

export default function AiAnalysis() {
    const paragraphs = [
        "The other person seems to be feeling frustrated, disappointed, or confused. There’s likely something deeper going on, and this could be their way of reaching out.",
        "When you respond, try to lead with empathy. Start by acknowledging what they’re feeling—even if you’re unsure, showing that you’re trying to understand can make a big difference.",
        "Before writing your message, take a moment to reflect:",
        "• What might they be feeling?",
        "• What’s the dynamic between you two right now?",
        "• What would you want to hear if you were in their shoes?",
        "When you're ready to respond, try beginning with something like:",
        "• A gentle acknowledgment (“I’ve been thinking about what you said…” or “It sounds like you’re really upset, and I want to understand why.”)",
        "• A question that invites them to share more (“Can we talk about it?” or “What’s been on your mind lately?”)",
        "• A bit of vulnerability (“I might not have realized how you felt, but I care and I’m here now.”)",
        "Write from a place of curiosity and care—it doesn’t have to be perfect. What matters most is that it feels real.",
    ];

    return (
        <View style={analysisStyles.container}>
            <Text style={analysisStyles.header}>Conversation Analysis</Text>
            <ScrollView style={analysisStyles.contentContainer}>
                {paragraphs.map((text, idx) => (
                    <Text key={idx} style={analysisStyles.analysisText}>
                        {text}
                    </Text>
                ))}
            </ScrollView>
        </View>
    );
}


const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F9F9F9",
        padding: 20,
        borderRadius: 16,
        maxHeight: height * 0.7, // take up 70% of screen height
    },
    header: {
        fontSize: 20,
        fontWeight: "700",
        color: "#222",
        marginBottom: 16,
    },
    scroll: {
        paddingRight: 4,
    },
    text: {
        fontSize: 16,
        lineHeight: 26,
        color: "#444",
        marginBottom: 12,
    },
});

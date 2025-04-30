import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, ActivityIndicator, Dimensions, StyleSheet } from "react-native";
import NlpApi from "@/api/nlp";

const screenHeight = Dimensions.get("window").height;

export default function AiAnalysis({ messageText }: { messageText: string }) {
    const [lines, setLines] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string|null>(null);

    useEffect(() => {
        let alive = true;
        NlpApi.analyzeMessage(messageText)
            .then(res => alive && setLines(res))
            .catch(err => alive && setError(err.message))
            .finally(() => alive && setLoading(false));
        return () => { alive = false; };
    }, [messageText]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Conversation Analysis</Text>
            <ScrollView style={styles.contentContainer}>
                {loading && <ActivityIndicator size="small" />}
                {error && <Text style={[styles.analysisText, { color: "red" }]}>Error: {error}</Text>}
                {!loading && !error && lines.map((l,i) => (
                    <Text key={i} style={styles.analysisText}>{l}</Text>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#F5F5F5",
        borderRadius: 16,
        maxHeight: screenHeight * 0.75,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 12,
    },
    contentContainer: {
        maxHeight: screenHeight * 0.55,
    },
    analysisText: {            // ← here’s your analysisText
        fontSize: 16,
        lineHeight: 26,
        marginBottom: 10,
    },
});

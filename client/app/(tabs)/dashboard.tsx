import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Appbar, Button, Card, PaperProvider } from "react-native-paper";
import { router } from "expo-router";
import DashboardApi from "@/api/dashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatFrequencyGraph from "@/components/ChatFrequencyGraph";

type Milestone = {
    friendName: string;
    updated: boolean;
    congrats: boolean;
    progress: number;
    repeat: number;
};

export default function DashboardScreen() {
    const [userId, setUserId] = useState("");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const initialize = async () => {
            const uid = await AsyncStorage.getItem("loggedInUserId");
            if (uid) {
                setUserId(uid);
                fetchMilestones(uid);
            }
            setLoading(false);
        };
        initialize();
    }, []);

    const fetchMilestones = async (uid: string) => {
        try {
            const data: Milestone[] = await DashboardApi.getMilestones(uid);
            setMilestones(data);
        } catch (err) {
            console.error("Error fetching milestones:", err);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Dashboard" />
                <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
            </Appbar.Header>
            {loading ? (
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            ) : (
                <View style={styles.content}>
                   <ChatFrequencyGraph userId={userId} />
                    <Text style={styles.sectionTitle}>Milestones</Text>
                    {milestones.length === 0 ? (
                        <Text style={styles.emptyText}>No milestones enabled.</Text>
                    ) : (
                        milestones.map((item, index) => (
                            <Card key={`milestone-${index}`} style={styles.card}>
                                <Card.Title title={item.friendName} />
                                <Card.Content>
                                    <Text>
                                        {item.updated
                                            ? item.congrats
                                                ? "Milestone achieved! Congratulations!"
                                                : "Milestone missed!"
                                            : "Milestone in progress"}
                                    </Text>
                                    <Text>
                                        Progress: {item.progress} / {item.repeat}
                                    </Text>
                                </Card.Content>
                            </Card>
                        ))
                    )}

                    <Button
                        mode="contained"
                        onPress={() => fetchMilestones(userId)}
                        style={styles.refreshButton}
                    >
                        Refresh Dashboard
                    </Button>
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FBFF",
    },
    loadingText: {
        textAlign: "center",
        marginTop: 20,
        fontSize: 16,
    },
    content: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 10,
    },
    card: {
        marginVertical: 5,
    },
    refreshButton: {
        marginVertical: 20,
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        marginVertical: 5,
    },
});

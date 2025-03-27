import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DashboardApi from "@/api/dashboard";

interface StreakItem {
    groupName: string;
    streak: string;
}

interface StreakDisplayProps {
    userId: string;
}

export default function StreakDisplay({ userId }: StreakDisplayProps) {
    const [streaks, setStreaks] = useState<StreakItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userId) return;
        fetchStreaks();
    }, [userId]);

    const fetchStreaks = async () => {
        try {
            setLoading(true);
            const data = await DashboardApi.getStreaks(userId);
            setStreaks(data);
        } catch (err) {
            console.error("Error fetching streaks:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Text style={styles.loadingText}>Loading streaks...</Text>;
    }

    // check if array is empty
    if (!streaks || streaks.length === 0) {
        return <Text style={styles.motivation}>No streaks yet. Keep it up!</Text>;
    }

    // check if *all* streaks are zero
    const allZero = streaks.every((item) => parseInt(item.streak, 10) === 0);
    if (allZero) {
        return <Text style={styles.motivation}>Every streak starts with day one. Let's begin yours today!</Text>;
    }

    return (
        <View style={styles.container}>
            {streaks.map((item, index) => {
                const numericStreak = parseInt(item.streak, 10) || 0;
                return (
                    <View key={`streak-${index}`} style={styles.card}>
                        <Text style={styles.streakLabel}>{item.groupName}</Text>
                        <Text style={styles.streakValue}>Streak: {numericStreak} days</Text>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    loadingText: {
        textAlign: "center",
        marginVertical: 8,
    },
    motivation: {
        textAlign: "center",
        marginVertical: 8,
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        elevation: 2,
    },
    streakLabel: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    streakValue: {
        fontSize: 14,
        color: "#555",
    },
});

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import DashboardApi from "@/api/dashboard";

interface StreakItem {
    groupName: string;
    streak: string;
    active: boolean;
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

    // convert streak value to a number and split into active and broken arrays
    const streakData = streaks.map(item => ({
        ...item,
        numericStreak: parseInt(item.streak, 10) || 0
    }));

    const activeStreaks = streakData.filter(item => item.numericStreak > 0 && item.active);
    const brokenStreaks = streakData.filter(item => item.numericStreak > 0 && !item.active);

    return (
        <View style={styles.container}>
            {loading ? (
                <Text style={styles.loadingText}>Loading streaks...</Text>
            ) : (
                <>
                    {activeStreaks.length === 0 && brokenStreaks.length === 0 ? (
                        <Text style={styles.motivation}>
                            Every streak starts with day one. Let's begin yours today!
                        </Text>
                    ) : (
                        <>
                            {activeStreaks.length > 0 && (
                                <>
                                    <Text style={styles.sectionHeader}>Active Streaks</Text>
                                    <View style={styles.grid}>
                                        {activeStreaks.map((item, index) => (
                                            <View key={index} style={styles.gridItem}>
                                                <Text style={styles.groupName}>{item.groupName}</Text>
                                                <Text style={styles.streak}>🔥 {item.numericStreak} day streak</Text>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}
                            {brokenStreaks.length > 0 && (
                                <>
                                    <Text style={styles.encouragement}>
                                        It's okay to miss a day – tomorrow's a new start!
                                    </Text>
                                    <View style={styles.brokenGrid}>
                                        {brokenStreaks.map((item, index) => (
                                            <View key={index} style={styles.brokenItem}>
                                                <Text style={styles.brokenGroup}>{item.groupName}</Text>
                                                <Text style={styles.brokenStreak}>
                                                    Last streak: {item.numericStreak} days
                                                </Text>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}
                        </>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 12,
    },
    loadingText: {
        textAlign: "center",
        marginVertical: 16,
        fontSize: 16,
        color: "#888",
    },
    motivation: {
        textAlign: "center",
        marginVertical: 16,
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
    },
    sectionHeader: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 8,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    gridItem: {
        width: "48%",
        backgroundColor: "#fdfdfd",
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
    },
    groupName: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 4,
    },
    streak: {
        fontSize: 14,
        color: "#444",
    },
    encouragement: {
        textAlign: "center",
        fontSize: 15,
        fontWeight: "500",
        color: "#999",
        marginVertical: 10,
    },
    brokenGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
    },
    brokenItem: {
        width: "48%",
        backgroundColor: "#f0f0f0",
        padding: 14,
        marginBottom: 12,
        borderRadius: 10,
        borderColor: "#ccc",
        borderWidth: 1,
        opacity: 0.6,
    },
    brokenGroup: {
        fontSize: 15,
        fontWeight: "500",
        color: "#555",
    },
    brokenStreak: {
        fontSize: 13,
        color: "#666",
    },
});


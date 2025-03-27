import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, ProgressBar, Text } from "react-native-paper";

export interface Milestone {
    friendName: string;
    updated: boolean;
    congrats: boolean;
    progress: number;
    repeat: number;
    description?: string;
}

interface MilestoneDisplayProps {
    milestones: Milestone[];
}

const MAX_DESCRIPTION_LENGTH = 50; // max character for description

export default function MilestoneDisplay({ milestones }: MilestoneDisplayProps) {
    if (!milestones || milestones.length === 0) {
        return (
            <Text style={styles.emptyText}>
                Start chatting to build milestones!
            </Text>
        );
    }

    return (
        <View style={styles.container}>
            {milestones.map((item, index) => {
                // determine status message based on milestone flags
                const isCompleted = item.updated && item.congrats;
                const isMissed = item.updated && !item.congrats;
                let statusMessage = "Milestone in progress";
                if (isCompleted) {
                    statusMessage = "Milestone achieved! Congratulations!";
                } else if (isMissed) {
                    statusMessage = "Milestone missed!";
                }

                // truncate description if needed
                const displayDescription =
                    item.description && item.description.length > MAX_DESCRIPTION_LENGTH
                        ? item.description.substring(0, MAX_DESCRIPTION_LENGTH) + "..."
                        : item.description || "No description provided";

                // calculate progress - ensuring repeat is nonzero
                const progressValue = item.repeat > 0 ? item.progress / item.repeat : 0;

                return (
                    <Card key={`milestone-${index}`} style={styles.card}>
                        <Card.Content>
                            <Text style={styles.description}>{displayDescription}</Text>
                            <Text style={styles.friendName}>Milestone for: {item.friendName}</Text>
                            <View style={styles.progressContainer}>
                                <ProgressBar
                                    progress={progressValue}
                                    color="#6750A4"
                                    style={styles.progressBar}
                                />
                            </View>
                            <Text style={styles.progressText}>
                                {item.progress} / {item.repeat} cycles completed
                            </Text>
                            <Text style={styles.status}>{statusMessage}</Text>
                        </Card.Content>
                    </Card>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 8,
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        color: "#777",
        marginVertical: 10,
    },
    card: {
        marginVertical: 6,
        borderRadius: 10,
        elevation: 2,
        overflow: "hidden",
        padding: 10,
    },
    description: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 6,
    },
    friendName: {
        fontSize: 12,
        color: "#777",
        marginBottom: 6,
    },
    progressContainer: {
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 6,
    },
    progressBar: {
        height: 20,
    },
    progressText: {
        fontSize: 12,
        color: "#555",
        marginBottom: 6,
    },
    status: {
        fontSize: 14,
        color: "#333",
    },
});

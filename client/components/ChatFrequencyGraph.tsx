import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DashboardApi from "@/api/dashboard";
import InteractiveBarChart, { OneToOneFrequency } from "@/components/InteractiveBarChart";

export default function ChatFrequencyGraph() {
    const [userId, setUserId] = useState("");
    const [frequencyData, setFrequencyData] = useState<OneToOneFrequency[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        async function initialize() {
            const uid = await AsyncStorage.getItem("loggedInUserId");
            if (uid) {
                setUserId(uid);
                fetchFrequency(uid);
            }
            setLoading(false);
        }
        initialize();
    }, []);

    const fetchFrequency = async (uid: string) => {
        try {
            const data: OneToOneFrequency[] = await DashboardApi.getOneToOneFrequency(uid);
            setFrequencyData(data);
        } catch (error) {
            console.error("Error fetching chat frequency:", error);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.sectionTitle}>Chat Frequency</Text>
                {loading ? (
                    <Text>Loading...</Text>
                ) : frequencyData.length > 0 ? (
                    <InteractiveBarChart data={frequencyData} />
                ) : (
                    <Text style={styles.emptyText}>No chat frequency data available.</Text>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FBFF",
    },
    content: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "600",
        marginVertical: 10,
    },
    emptyText: {
        textAlign: "center",
        color: "#777",
        marginVertical: 10,
    },
    refreshButton: {
        marginVertical: 20,
    },
});

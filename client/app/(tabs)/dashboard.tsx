import React, {useState, useEffect, useCallback} from "react";
import {ScrollView, StyleSheet, View, Text} from "react-native";
import {Appbar, Button, Card, PaperProvider} from "react-native-paper";
import {router, useFocusEffect} from "expo-router";
import DashboardApi from "@/api/dashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatFrequencyGraph from "@/components/ChatFrequencyGraph";
import StreakDisplay from "@/components/StreakDisplay";
import MilestoneDisplay, {Milestone} from "@/components/MilestoneDisplay";

export default function DashboardScreen() {
    const [userId, setUserId] = useState("");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);


    const initialize = useCallback( // prevent infinite loop
        async () => {
            const uid = await AsyncStorage.getItem("loggedInUserId");
            if (uid) {
                setUserId(uid);
                try {
                    await fetchMilestones(uid);
                } catch (err) {
                    router.replace("/login")
                }
            } else {
                router.replace("/login")
            }
            setLoading(false);
        }, [])

    useFocusEffect(useCallback(() => {
        initialize();
    }, []));

    const fetchMilestones = async (uid: string) => {
        try {
            const data: Milestone[] = await DashboardApi.getMilestones(uid);
            setMilestones(data);
        } catch (err) {
            console.error("Error fetching milestones:", err);
            throw new Error()
        }
    };


    return (
        <ScrollView style={styles.container}>
            <Appbar.Header>
                <Appbar.Content title="Dashboard"/>
                <Appbar.Action icon="cog" onPress={() => router.push("/settings")}/>
            </Appbar.Header>
            {loading ? (
                <Text style={styles.loadingText}>Loading dashboard...</Text>
            ) : (
                <View style={styles.content}>
                    <ChatFrequencyGraph/>

                    <Text style={styles.sectionTitle}>Chat Streaks</Text>
                    <StreakDisplay userId={userId}/>

                    <Text style={styles.sectionTitle}>Milestones</Text>
                    <MilestoneDisplay milestones={milestones}/>

                    <Button
                        mode="contained"
                        onPress={() => fetchMilestones(userId)}
                        style={styles.refreshButton}
                    >
                        Refresh Milestones
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
    refreshButton: {
        marginVertical: 20,
    },
});

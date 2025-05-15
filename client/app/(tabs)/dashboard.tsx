import React, {useState, useCallback, useEffect} from "react";
import { ScrollView, StyleSheet, View, Text, Alert } from "react-native";
import { Appbar, PaperProvider, Portal, Modal, Button } from "react-native-paper";
import { router, useFocusEffect } from "expo-router";
import DashboardApi from "@/api/dashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChatFrequencyGraph from "@/components/ChatFrequencyGraph";
import StreakDisplay from "@/components/StreakDisplay";
import MilestoneDisplay, {Milestone} from "@/components/MilestoneDisplay";
import {closeWebSocket, connectWebSocket} from "@/utils/websocket";
import CapsuleApi from "@/api/capsule";
import UserApi from "@/api/user";
import { getDisplayName } from "@/utils/displayName";
import eventEmitter from "@/utils/eventEmitter";
import LottieView from "lottie-react-native";

export default function DashboardScreen() {
    const [userId, setUserId] = useState("");
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [queue, setQueue] = useState<{ from: string; message: string }[]>([]);
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState<{ from: string; message: string } | null>(null);
    const [stage, setStage] = useState<'prompt'|'animation'|'message'>('prompt');

    // only add a capsule if it's not already queued
    const enqueue = (from: string, message: string) => {
        setQueue(prev => {
            const newQ = [...prev, { from, message }];
            // if this is the only item and no modal is up yet — show it immediately
            if (!visible && newQ.length === 1) {
                setCurrent(newQ[0]);
                setStage("prompt");
                setVisible(true);
            }
            return newQ;
        });
    };

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
            connectWebSocket();
            setLoading(false);
        }, [])

    useFocusEffect(useCallback(() => {
        initialize();
    }, []));

    // load any ready capsules on login
    useEffect(() => {
        (async () => {
            const idStr = await AsyncStorage.getItem("loggedInUserId");
            if (!idStr) return;
            try {
                const ready = await CapsuleApi.fetchReady(Number(idStr));
                for (const c of ready) {
                    const u = await UserApi.getUserById(c.creatorId);
                    enqueue(getDisplayName({ username: u.username }, undefined), c.message);
                }
            } catch (e) {
                console.warn("Error fetching ready capsules", e);
            }
        })();
    }, []);

    // live WebSocket listener
    useEffect(() => {
        connectWebSocket();
        const sub = eventEmitter.addListener("message", async raw => {
            try {
                const c = JSON.parse(raw);
                const idStr = await AsyncStorage.getItem("loggedInUserId");
                if (idStr && c.targetUserId === Number(idStr)) {
                    const u = await UserApi.getUserById(c.creatorId);
                    enqueue(getDisplayName({ username: u.username }, undefined), c.message);
                }
            } catch {}
        });
        return () => {
            sub.remove();
            closeWebSocket();
        };
    }, []);

    const onClose = () => {
        // hide current
        setVisible(false);

        // dequeue and, if there’s another, show it
        setQueue(prev => {
            const [, ...rest] = prev;
            if (rest.length > 0) {
                // give the Modal time to fully close
                setTimeout(() => {
                    setCurrent(rest[0]);
                    setStage("prompt");
                    setVisible(true);
                }, 300);
            }
            return rest;
        });

        // clear out current immediately
        setCurrent(null);
    };

    const fetchMilestones = async (uid: string) => {
        try {
            const data: Milestone[] = await DashboardApi.getMilestones(uid);
            setMilestones(data);
        } catch (err) {
            console.error("Error fetching milestones:", err);
        }
    };

    useFocusEffect(
        useCallback(() => {
            initialize();
        }, [initialize])
    );

    useFocusEffect(
        useCallback(() => {
            const missed = milestones.filter((m) => m.updated && !m.congrats);
            if (missed.length > 0) {
                Alert.alert(
                    "Milestone Warning",
                    `You missed your messaging goal for ${missed[0].friendName}. Please review your milestones.`
                );
            }
        }, [milestones])
    );

    return (
        <>
            <Portal>
                <Modal
                    visible={visible}
                    dismissable={false}
                    onDismiss={() => {
                        // only once the modal is fully closed
                        setQueue(q => q.slice(1));
                        setCurrent(null);
                        setStage("prompt");
                    }}
                    contentContainerStyle={{
                        margin: 20,
                        padding: 24,
                        backgroundColor: 'white',
                        borderRadius: 12,
                        alignItems: 'center',
                    }}
                >
                    {stage === 'prompt' && current && (
                        <>
                            <Text>You have a capsule from {current.from} ready to unlock</Text>
                            <Button onPress={() => setStage('animation')}>Unlock</Button>
                        </>
                    )}

                    {stage === 'animation' && (
                        <LottieView
                            source={require('@/app/(tabs)/unlock_animation.json')}
                            autoPlay loop={false}
                            onAnimationFinish={() => setStage('message')}
                            style={{ width:200, height:200 }}
                        />
                    )}

                    {stage === 'message' && current && (
                        <>
                            <Text>"{current.message}"</Text>
                            <Button onPress={() => {
                                // hide & dequeue immediately
                                setVisible(false);
                                setQueue(prev => {
                                    const [, ...rest] = prev;
                                    return rest;
                                });
                                setCurrent(null);
                            }}>
                                Close
                            </Button>
                        </>
                    )}
                </Modal>
            </Portal>
            <ScrollView style={styles.container}>
                <Appbar.Header>
                    <Appbar.Content title="Dashboard" />
                    <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
                </Appbar.Header>

                {loading ? (
                    <Text style={styles.loadingText}>Loading dashboard...</Text>
                ) : (
                    <View style={styles.content}>
                        <ChatFrequencyGraph />
                        <Text style={styles.sectionTitle}>Chat Streaks</Text>
                        <StreakDisplay userId={userId} />
                        <Text style={styles.sectionTitle}>Milestones</Text>
                        <MilestoneDisplay milestones={milestones} />
                    </View>
                )}
            </ScrollView>
        </>
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
});
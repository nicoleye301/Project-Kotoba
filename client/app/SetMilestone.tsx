import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View, Text } from "react-native";
import { Appbar, TextInput, Button, Snackbar, Provider } from "react-native-paper";
import { useSearchParams } from "expo-router/build/hooks";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FriendApi from "@/api/friend";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function SetMilestoneScreen() {
    const searchParams = useSearchParams();
    const friendId = searchParams.get("friendId");
    const friendName = searchParams.get("friendName");

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [startDate, setStartDate] = useState<string>("");
    const [goalInterval, setGoalInterval] = useState<string>("7");
    const [goalCycles, setGoalCycles] = useState<string>("4");
    const [goalDescription, setGoalDescription] = useState<string>(""); // NEW FIELD
    const [loading, setLoading] = useState<boolean>(false);
    const [snackbarVisible, setSnackbarVisible] = useState<boolean>(false);
    const [snackbarMessage, setSnackbarMessage] = useState<string>("");
    const [showDatePicker, setShowDatePicker] = useState<boolean>(false);

    useEffect(() => {
        AsyncStorage.getItem("loggedInUserId")
            .then((id) => {
                if (id) {
                    setCurrentUserId(Number(id));
                }
            })
            .catch((error) => console.error("Error retrieving user ID", error));
    }, []);

    const onChangeDate = (event: any, selectedDate?: Date) => {
        if (event.type === "dismissed") {
            setShowDatePicker(false);
            return;
        }
        if (selectedDate) {
            const year = selectedDate.getFullYear();
            const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
            const day = selectedDate.getDate().toString().padStart(2, "0");
            setStartDate(`${year}-${month}-${day}`);
        }
        setShowDatePicker(false);
    };

    const handleSetMilestone = async () => {
        if (!currentUserId) {
            setSnackbarMessage("User not logged in.");
            setSnackbarVisible(true);
            return;
        }
        if (!friendId) {
            setSnackbarMessage("Friend ID is missing.");
            setSnackbarVisible(true);
            return;
        }
        if (!startDate) {
            setSnackbarMessage("Please select a start date.");
            setSnackbarVisible(true);
            return;
        }
        const parsedDate = new Date(startDate);
        if (isNaN(parsedDate.getTime())) {
            setSnackbarMessage("Invalid start date format.");
            setSnackbarVisible(true);
            return;
        }

        // milestone settings
        const milestoneSettingsObj = {
            startTime: Math.floor(parsedDate.getTime() / 1000), // epoch seconds
            period: parseInt(goalInterval, 10),
            repeat: parseInt(goalCycles, 10),
            progress: 0,
            description: goalDescription.trim(),
        };
        const milestoneSettings = JSON.stringify(milestoneSettingsObj);

        setLoading(true);
        try {
            const payload = {
                currentUserId: currentUserId,
                friendId: Number(friendId),
                milestoneSettings: milestoneSettings,
            };
            await FriendApi.setMilestone(payload);
            setSnackbarMessage("Milestone updated successfully!");
            setSnackbarVisible(true);
            setTimeout(() => {
                router.back();
            }, 1500);
        } catch (error) {
            console.error("Error setting milestone", error);
            setSnackbarMessage("Error setting milestone.");
            setSnackbarVisible(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Provider>
            <ScrollView style={styles.container}>
                <Appbar.Header>
                    <Appbar.BackAction onPress={() => router.back()} />
                    <Appbar.Content title={`Set Milestone for ${friendName}`} />
                </Appbar.Header>

                <View style={styles.form}>
                    <Text style={styles.label}>Start Date</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="Select date"
                        value={startDate}
                        onFocus={() => setShowDatePicker(true)}
                        style={styles.input}
                    />
                    {showDatePicker && (
                        <DateTimePicker
                            value={startDate ? new Date(startDate) : new Date()}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    <Text style={styles.label}>Goal Interval (days)</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="e.g. 7"
                        value={goalInterval}
                        onChangeText={setGoalInterval}
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    <Text style={styles.label}>Number of Goal Cycles</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="e.g. 4"
                        value={goalCycles}
                        onChangeText={setGoalCycles}
                        keyboardType="numeric"
                        style={styles.input}
                    />
                    <Text style={styles.label}>Goal Description</Text>
                    <TextInput
                        mode="outlined"
                        placeholder="e.g. 'Check in weekly'"
                        value={goalDescription}
                        onChangeText={(text) => {
                            // limit to 40 chars
                            if (text.length <= 40) {
                                setGoalDescription(text);
                            }
                        }}
                        style={styles.input}
                    />
                    <Text style={styles.charCount}>{goalDescription.length}/40</Text>

                    <Button
                        mode="contained"
                        onPress={handleSetMilestone}
                        loading={loading}
                        style={styles.button}
                    >
                        Set Milestone
                    </Button>
                </View>

                <Snackbar
                    visible={snackbarVisible}
                    onDismiss={() => setSnackbarVisible(false)}
                    duration={3000}
                >
                    {snackbarMessage}
                </Snackbar>
            </ScrollView>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F9FBFF",
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        marginBottom: 4,
        color: "#333",
    },
    input: {
        marginBottom: 12,
    },
    charCount: {
        alignSelf: "flex-end",
        marginBottom: 16,
        fontSize: 12,
        color: "#666",
    },
    button: {
        marginTop: 20,
    },
});

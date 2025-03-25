import React, {useEffect, useState} from "react";
import { Button, View } from "react-native";
import { connectWebSocket } from "@/utils/websocket";
import { router } from "expo-router";
import { Appbar } from "react-native-paper";
import DashboardApi from "@/api/dashboard"
import AsyncStorage from "@react-native-async-storage/async-storage";
import userApi from "@/api/user";

export default function Dashboard() {
    const [userId, setUserId] = useState('')

    useEffect(() => {
        // establish WebSocket connection when component mounts
        connectWebSocket();
    }, []);

    useEffect(() => {
        initialize().then()
    }, []);

    const initialize =async ()=>{
        const userId = await AsyncStorage.getItem('loggedInUserId')
        if (userId) {
            setUserId(userId)
        }
    }

    const pressButton = async () => {
        if (userId) {
            console.log(await DashboardApi.getStreaks(userId))
        }
    }

    return (
        <View>
            <Appbar.Header>
                <Appbar.Content title="Dashboard" />
                <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
            </Appbar.Header>
            <Button title="get streaks" onPress={pressButton}/>
        </View>
    );
}

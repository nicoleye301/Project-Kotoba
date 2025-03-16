import React, { useEffect } from "react";
import { Button, View } from "react-native";
import { connect, sendMessage } from "@/utils/websocket";
import { router } from "expo-router";
import { Appbar } from "react-native-paper";

export default function Dashboard() {
    useEffect(() => {
        // establish WebSocket connection when component mounts
        connect();
    }, []);

    const ping = () => {
        sendMessage("ping");
    };

    return (
        <Appbar.Header>
            <Appbar.Content title="Dashboard" />
            <Appbar.Action icon="cog" onPress={() => router.push("/settings")} />
        </Appbar.Header>
    );
}

import React, { useEffect } from "react";
import { Button, View } from "react-native";
import { connect, sendMessage } from "@/utils/websocket";
import { router } from "expo-router";

export default function Home() {
    useEffect(() => {
        // establish WebSocket connection when component mounts
        connect();
    }, []);

    const ping = () => {
        sendMessage("ping");
    };

    return (
        <View>
            <Button title="Ping" onPress={ping} />
        </View>
    );
}

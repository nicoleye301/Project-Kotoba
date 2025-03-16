import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { LightTheme, DarkTheme } from "@/theme/theme";
import { useColorScheme } from "react-native";

export default function RootLayout() {
    const scheme = useColorScheme(); // detects system light/dark mode

    return (
        <PaperProvider theme={scheme === "dark" ? DarkTheme : LightTheme}>
            <Stack screenOptions={{headerShown: false}}>
                {/* Hide header on auth screens */}
                <Stack.Screen name="login" options={{ headerShown: false }} />
                <Stack.Screen name="register" options={{ headerShown: false }} />
                {/* The tabs layout is nested */}
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                {/* Conversation screen (for both personal and group chats) */}
                <Stack.Screen name="conversation" options={{ title: "Conversation" }} />
                <Stack.Screen name="settings" options={{ title: "Settings" }} />
            </Stack>
        </PaperProvider>
    );
}

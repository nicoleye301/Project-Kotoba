import { Stack } from "expo-router";
export default function RootLayout() {
    return (
        <Stack>
            {/* Hide header on auth screens */}
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            {/* The tabs layout is nested */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* Conversation screen (for both personal and group chats) */}
            <Stack.Screen name="conversation" options={{ title: "Conversation" }} />
        </Stack>
    );
}

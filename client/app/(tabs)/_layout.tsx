import { Tabs } from "expo-router";
import {Icon} from "react-native-paper";

export default function TabLayout() {
    return (
        <Tabs screenOptions={{headerShown: false}}>
            <Tabs.Screen
                name="chat"
                options={{ title: "Chat", tabBarIcon: ({ color, size }) => (
                        <Icon source="chat" size={size} color={color} />
                    ) }}
            />
            <Tabs.Screen
                name="contacts"
                options={{ title: "Contacts", tabBarIcon: ({ color, size }) => (
                        <Icon source="account" size={size} color={color} />
                    ) }}
            />
            <Tabs.Screen
                name="posts"
                options={{ title: "Posts", tabBarIcon: ({ color, size }) => (
                        <Icon source="compass" size={size} color={color} />
                    ) }}
            />
            <Tabs.Screen
                name="dashboard"
                options={{ title: "Dashboard", tabBarIcon: ({ color, size }) => (
                        <Icon source="home" size={size} color={color} />
                    ) }}
            />
            <Tabs.Screen
                name="Report"
                options={{ title: "Report", tabBarIcon: ({ color, size }) => (
                            <Icon source="compass" size={size} color={color} />
                        ) }}
            />
            <Tabs.Screen
                name="TimeCapsule"
                options={{
                    title: "Capsule",
                    tabBarIcon: ({ color, size }) => (
                        <Icon source="clock" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

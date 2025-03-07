import { Tabs } from "expo-router";

export default function TabLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="chat"
                options={{ title: "Chat", tabBarIcon: () => <></> }} // Add an icon component as needed
            />
            <Tabs.Screen
                name="contacts"
                options={{ title: "Contacts", tabBarIcon: () => <></> }}
            />
            <Tabs.Screen
                name="posts"
                options={{ title: "Posts", tabBarIcon: () => <></> }}
            />
            <Tabs.Screen
                name="profile"
                options={{ title: "Profile", tabBarIcon: () => <></> }}
            />
        </Tabs>
    );
}

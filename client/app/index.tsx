import { Redirect } from "expo-router";
import { Platform } from "react-native";

export default function Index() {
    if (Platform.OS === "android") {
        // @ts-ignore
        import("expo-navigation-bar").then((NavigationBar) => {
            NavigationBar.setBackgroundColorAsync("white");
            NavigationBar.setButtonStyleAsync("dark");
        });
    }

    return <Redirect href="/(tabs)/dashboard" />;
}

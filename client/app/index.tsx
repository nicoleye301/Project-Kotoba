import { Redirect } from "expo-router";
import * as NavigationBar from 'expo-navigation-bar';

export default function Index() {
    NavigationBar.setBackgroundColorAsync("white")
    NavigationBar.setButtonStyleAsync('dark');
    return <Redirect href="/(tabs)/dashboard" />;
}

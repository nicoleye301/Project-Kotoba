import {Button, View, TextInput, Text, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, router} from "expo-router";
import {useState} from "react";
import LoginApi from "@/api/login";
import SettingsApi from "@/api/settings"
import {connectWebSocket} from "@/utils/websocket";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const data = await LoginApi.login({username, password});
            await AsyncStorage.setItem("loggedInUserId", data.id.toString());
            connectWebSocket();
            await getUserSettings(data.id)
            router.replace("/(tabs)/dashboard");
        } catch (error) {
            console.error(error);
            alert("Failed");
        }
    };

    const getUserSettings = async (userId: number) => {
        const userSettings:string = await SettingsApi.getSettings(userId)
        if(userSettings){
            await Promise.all(Object.entries(userSettings).map(([name, value]) =>
                    AsyncStorage.setItem(name, JSON.stringify(value))
                )
            )
        }
    }

    return (
        <View style={styles.container}>
            <Text>Username:</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
            />

            <Text>Password:</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={true}
            />

            <Button title="Login" onPress={handleLogin}/>
            <Link href="/register" replace>
                Register
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 400,
        margin: 50,
        textAlign: "center",
        fontFamily: "Arial",
        padding: 20,
        borderRadius: 8,
    },
    input: {},
});
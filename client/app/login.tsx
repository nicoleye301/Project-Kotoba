import { Button, View, TextInput, Text, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, router } from "expo-router";
import { useState } from "react";
import LoginApi from "@/api/login";
import { connect } from "@/utils/websocket";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const data = await LoginApi.login({ username, password });
            await AsyncStorage.setItem("loggedInUserId", data.id.toString());
            connect();
            router.replace("/(tabs)/home");
        } catch (error) {
            console.error(error);
            alert("Failed");
        }
    };

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

            <Button title="Login" onPress={handleLogin} />
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
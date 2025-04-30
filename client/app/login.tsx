import {SafeAreaView, KeyboardAvoidingView, Platform, View, TextInput, Text, TouchableOpacity, StyleSheet,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, router} from "expo-router";
import {useState} from "react";
import LoginApi from "@/api/login";
import SettingsApi from "@/api/settings";
import { MotiView, MotiImage } from "moti";

const LOGO = require("@/assets/images/logo cropped.png");

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const data = await LoginApi.login({username, password});
            await AsyncStorage.setItem("loggedInUserId", data.id.toString());
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
        <SafeAreaView style={styles.safe}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "android" ? "padding" : undefined}
                style={styles.container}
            >
                {/* animation */}
                <MotiImage
                    source={LOGO}
                    style={styles.logo}
                    from={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", delay: 300, damping: 12, stiffness: 90 }}
                />

                {/* login form card */}
                <View style={styles.card}>
                    <Text style={styles.title}>Welcome Back</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Logging in…" : "Log In"}
                        </Text>
                    </TouchableOpacity>

                    <Link href="/register" style={styles.link}>
                        Don’t have an account? Sign up
                    </Link>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#f2f2f7",
    },
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    logoWrapper: {
        marginBottom: 8,
        alignItems: "center",
    },
    logo: {
        width: "100%",
        maxWidth: 300,
        height: undefined,
        aspectRatio: 500 / 300,
        marginBottom: 24,
    },
    card: {
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 24,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: "600",
        marginBottom: 16,
        textAlign: "center",
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
        fontSize: 16,
    },
    button: {
        width: "100%",
        backgroundColor: "#007aff",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: "#a0cfff",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },
    link: {
        marginTop: 16,
        textAlign: "center",
        color: "#007aff",
        fontSize: 14,
    },
});
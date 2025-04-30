import {SafeAreaView, KeyboardAvoidingView, Platform, View, TextInput, Text, TouchableOpacity, StyleSheet,} from "react-native";import {Link, router} from "expo-router";
import {useState} from "react";
import RegisterApi from "@/api/register";
import { MotiImage } from "moti";

const LOGO = require("@/assets/images/logo cropped.png");

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setLoading(true);
        try {
            await RegisterApi.register({ username, password });
            alert("Account created!");
            //  navigate directly to login:
            router.replace("/login");
        } catch (err) {
            console.error(err);
            alert("Registration failed. Try a different username.");
        } finally {
            setLoading(false);
        }
    };

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

                {/* register form card */}
                <View style={styles.card}>
                    <Text style={styles.title}>Create Account</Text>

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
                        onPress={handleRegister}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>
                            {loading ? "Registering…" : "Sign Up"}
                        </Text>
                    </TouchableOpacity>

                    <Link href="/login" style={styles.link}>
                        Already have an account? Log in
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
        backgroundColor: "#34c759",
        borderRadius: 8,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 8,
    },
    buttonDisabled: {
        backgroundColor: "#a6eac9",
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








import {Button, View, StyleSheet, TextInput, Text} from "react-native";
import {Link, router} from "expo-router";
import {useState} from "react";
import RegisterApi from "@/api/register";


export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleRegister = async () => {
        try{
            await RegisterApi.register({username, password})
            alert('Success')
        }
        catch(error){
            console.error(error)
            alert('Failed')
        }
    };

    return (
        <View style={styles.container}>
            <Text >Username:</Text>
            <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your name"
            />

            <Text >Password:</Text>
            <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry={true}
            />

            <Button title='Register' onPress={handleRegister}/>
            <Link href="/login" replace>Login</Link>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 400,
        margin: 50,
        textAlign: "center",
        fontFamily: 'Arial',
        padding: 20,
        borderRadius: 8,
    },
    input:{
    }

});

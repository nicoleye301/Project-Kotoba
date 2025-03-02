import {Button, Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {useEffect} from "react";
import eventEmitter from "@/utils/eventEmitter";
import ChatApi from "@/api/message"
import {connectWebSocket} from "@/utils/websocket";


export default function Home() {

    const checkLoggedIn =async () => {
        const user = await AsyncStorage.getItem('loggedIn')
        if (!!user){
            console.log("login success")
        }
        else{
            console.log("Not logged in!")
            router.replace("/login");
        }
    }

    const ping=()=>{
        ChatApi.sendMessage('ping')
    }


    useEffect(() => {
        checkLoggedIn()
        connectWebSocket()
        const listener = eventEmitter.addListener("message", (data) => {
            console.log("Received message:", data);
        });

        return () => {
            listener.remove();
        }
    }, []);

    return (
        <View>
            <Button title={'ping'} onPress={ping}></Button>
        </View>
    );
}
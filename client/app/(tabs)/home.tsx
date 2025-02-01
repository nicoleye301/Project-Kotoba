import {Button, Text, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import {useEffect} from "react";


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

    useEffect(() => {
        checkLoggedIn()
    }, []);

    return (
        <View>

        </View>
    );
}
import {Button, View, Text, Pressable, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import { close } from "@/utils/websocket";
import SettingList from "@/components/SettingList"
import {Appbar} from "react-native-paper";
import React from "react";


export default function Settings(){
    const handleLogout = async () => {
        await AsyncStorage.removeItem("loggedInUserId");
        // close the WebSocket connection on logout
        close();
        router.replace("/login");
    };

    return (
        <View style={{flex:1}}>
            <Appbar.Header>
                <Appbar.Content title="Settings" />
            </Appbar.Header>
            <SettingList/>
            <Button title='logout' onPress={handleLogout}/>
        </View>
    )
}

import {Button, View, Text, Pressable, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import { close } from "@/utils/websocket";
import SettingList from "@/components/SettingList"


export default function profile(){
    const handleLogout = async () => {
        await AsyncStorage.removeItem("loggedInUserId");
        // close the WebSocket connection on logout
        close();
        router.replace("/login");
    };

    return (
        <View style={{ flex: 1, backgroundColor: 'white' }}>
            <SettingList/>
            <Button title='logout' onPress={handleLogout}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
})
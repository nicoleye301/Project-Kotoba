import {Button, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import { close } from "@/utils/websocket";


export default function profile(){
    const handleLogout = async () => {
        await AsyncStorage.removeItem("loggedInUserId");
        // close the WebSocket connection on logout
        close();
        router.replace("/login");
    };

    return (
        <View>
            <Button title='logout' onPress={handleLogout}/>
        </View>
    )
}
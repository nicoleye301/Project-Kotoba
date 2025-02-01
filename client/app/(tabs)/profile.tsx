import {Button, View} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";


export default function profile(){
    const handleLogout = async () => {
        await AsyncStorage.removeItem('loggedIn')
        router.replace("/login")
    };

    return (
        <View>
            <Button title='logout' onPress={handleLogout}/>
        </View>
    )
}
import * as ImagePicker from "expo-image-picker";
import { SetStateAction } from "react";

const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
        alert('Permission denied!')
        return null
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    })

    if (!pickerResult.canceled) {
        return pickerResult.assets[0].uri
    }
    return null
}
export default pickImage
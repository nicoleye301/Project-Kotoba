import * as ImagePicker from "expo-image-picker";

const pickImage = async (setAvatar: (arg0: string) => void) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
        alert('Permission denied!')
        return
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
    })

    if (!pickerResult.canceled) {
        setAvatar(pickerResult.assets[0].uri)
    }
}
export default pickImage
import {View, Text, Pressable, StyleSheet} from "react-native";

interface SettingItem{
    name: string,
    onclick: {}
}

export default function settingList() {
    const settings = [
        {
            name: 'password'
        },
        {
            name: 'profile'
        },
        {
            name: 'mute'
        }
    ]

    return (
        <View>
            {settings.map((item, index) => (
                <Pressable key={item.name}>
                    <View style={styles.item}>
                        <Text>{item.name}</Text>
                    </View>

                </Pressable>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "white",
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
    },
    item: {
        backgroundColor: "#ececec",
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#c8c8c8",
    },
    text: {
        color: "white",
        fontSize: 16,
    },
});
import {Dispatch, SetStateAction, useState} from "react";
import {ScrollView, View} from "react-native";
import {List, Switch, TextInput, Divider, PaperProvider} from 'react-native-paper';

interface SettingItem<T> {
    name: string
    icon: string
    value: T
    setValue: Dispatch<SetStateAction<T>>
}

interface SettingGroup {
    name: string
    items: (SettingItem<string> | SettingItem<boolean>)[]
}

export default function settingList() {

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [password, setPassword] = useState('');

    const settings: SettingGroup[] = [
        {
            name: 'General',
            items: [
                {
                    name: "Password",
                    icon: "account",
                    value: password,
                    setValue: setPassword
                },
                {
                    name: "Muted",
                    icon: 'bell-outline',
                    value: notificationsEnabled,
                    setValue: setNotificationsEnabled
                }
            ]
        }
    ]

    return (
        <PaperProvider>
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                {settings.map((group,index) => {
                    return <List.Section title={group.name} key={index}>
                        {group.items.map((item, index) => {
                            return <View key={index}>
                                <List.Item
                                    title={item.name}
                                    left={() => <List.Icon icon={item.icon} style={{marginLeft: 16}}/>}
                                    right={() => {
                                        if (typeof item.value === "string") {
                                            return <TextInput
                                                mode="outlined"
                                                value={item.value}
                                                onChangeText={item.setValue}
                                                style={{width: 150, height: 40}}
                                            />
                                        } else {
                                            return <Switch
                                                value={item.value}
                                                onValueChange={item.setValue}
                                            />
                                        }
                                    }}
                                />
                                {(index !== group.items.length - 1) && <Divider/>}
                            </View>
                        })}
                    </List.Section>
                })}
            </ScrollView>
        </PaperProvider>
    );
}

import {useState} from "react";
import {View, Text, Pressable, StyleSheet, ScrollView} from "react-native";
import {List, Switch, TextInput, Divider, PaperProvider, MD3LightTheme} from 'react-native-paper';


interface SettingItem {
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

    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [username, setUsername] = useState('');

    return (
        <PaperProvider>
            <ScrollView style={{flex: 1, backgroundColor: 'white'}}>
                <List.Section title="Account">
                    <List.Item
                        title="Password"
                        left={() => <List.Icon icon="account" style={{ marginLeft: 16 }}/>}
                        right={() => (
                            <TextInput
                                mode="outlined"
                                value={username}
                                onChangeText={setUsername}
                                style={{width: 150, height: 40}}
                            />
                        )}
                    />
                    <Divider/>
                    <List.Item
                        title="Notification"
                        left={() => <List.Icon icon="bell-outline" style={{ marginLeft: 16 }}/>}
                        right={() => (
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                            />
                        )}
                    />
                </List.Section>

                <List.Section title="Others">
                    <List.Item
                        title="Setting1"
                        left={() => <List.Icon icon="fingerprint" style={{ marginLeft: 16 }}/>}
                        right={() => <Switch value={false}/>}
                    />
                    <Divider/>
                    <List.Item
                        title="Setting2"
                        left={() => <List.Icon icon="eye-outline" style={{ marginLeft: 16 }}/>}
                        right={() => <Switch value={true}/>}
                    />
                </List.Section>
            </ScrollView>
        </PaperProvider>
    );
}

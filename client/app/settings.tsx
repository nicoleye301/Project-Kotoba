import {View, FlatList, Image, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {router} from "expo-router";
import * as ImagePicker from 'expo-image-picker';
import {closeWebSocket} from "@/utils/websocket";
import {Appbar, Divider, List, PaperProvider, Switch, TextInput, Button, Text} from "react-native-paper";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import settingsApi from "@/api/settings"
import userApi from "@/api/user"
import Constants from "expo-constants";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;


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

export default function Settings() {

    const [userId, setUserId] = useState('')
    const [userName, setUserName] = useState('')
    const [avatar, setAvatar] = useState<string|null>(null);
    const [mute, setMute] = useState(false);
    const [password, setPassword] = useState('');

    // the structure of setting items
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
                    value: mute,
                    setValue: setMute
                }
            ]
        }
    ]

    //load settings from async storage
    useEffect(() => {
        loadSettings().then()
    }, []);

    const loadSettings = async () => {
        await Promise.all(settings.map((group) => {
            return Promise.all(group.items.map(async (item) => {
                const value = await AsyncStorage.getItem(item.name)
                if (value !== null) {
                    if (typeof item.value === 'string') {
                        item.setValue(value)
                    } else {
                        item.setValue(value === 'true')
                    }
                }
            }))
        }))
        const userId = await AsyncStorage.getItem('loggedInUserId')
        if (userId) {
            setUserId(userId)
            const user = await userApi.getUserById(parseInt(userId))
            setUserName(user.username)
            if (user.avatar){
                setAvatar(BASE_URL+"/uploads/avatar/"+user.avatar)
            }
        }
    }

    const pickImage = async () => {
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

    const handleSave = async () => {
        try {
            const settingsData: Record<string, string | boolean> = {}
            await Promise.all(
                settings.map((group) => {
                    return Promise.all(group.items.map(async (item) => {
                        if (item.name === 'Password') {
                            if (item.value) {
                                await settingsApi.setPassword({userId: userId, password: item.value})
                            }
                        } else {
                            await AsyncStorage.setItem(item.name, String(item.value))
                            settingsData[item.name] = item.value
                        }
                    }))
                })
            )
            await settingsApi.uploadSettings({userId: userId, settings: JSON.stringify(settingsData)})

        } catch (err) {
            alert("cannot update user settings: " + err)
        }

        try{
            // upload avatar
            if(avatar){
                const formData = new FormData()
                formData.append('userId', userId)
                // @ts-ignore
                formData.append('avatar', {
                    uri: avatar,
                    name: "avatar",
                    type: 'image/jpeg'
                })
                await settingsApi.uploadAvatar(formData)
            }
        }
        catch(err){
            alert("error uploading avatar: " +err)
        }
        router.back()
    }

    const handleLogout = async () => {
        await AsyncStorage.clear()
        closeWebSocket()
        router.replace("/login")
    };

    return (
        <View style={{flex: 1}}>

            <Appbar.Header>
                <Appbar.Content title="Settings"/>
            </Appbar.Header>

            <PaperProvider>
                <FlatList ListHeaderComponent={
                    <List.Item
                        title={userName}
                        left={() => <Image source={{uri: (avatar?avatar:BASE_URL+"/uploads/avatar/default.jpg")}} style={styles.avatar}/>}
                        onPress={pickImage}
                    />
                }
                          data={settings}
                          keyExtractor={(item) => item.name}
                          renderItem={({item}) => {
                              return <List.Section title={item.name} key={item.name}>
                                  <FlatList data={item.items}
                                            keyExtractor={(item) => item.name}
                                            ItemSeparatorComponent={() => <Divider/>}
                                            renderItem={({item}) => {
                                                return <List.Item
                                                    title={item.name}
                                                    left={() => <List.Icon icon={item.icon} style={{marginLeft: 16}}/>}
                                                    right={() => {
                                                        if (typeof item.value === "string") {
                                                            return <TextInput
                                                                mode="flat"
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
                                            }}/>
                              </List.Section>
                          }}
                          ListFooterComponent={
                              <View style={{flexDirection: "column", padding: 16}}>
                                  <Button mode="contained" onPress={handleSave}>
                                      Save
                                  </Button>
                                  <View style={{height: 10}}/>
                                  <Button mode="text" onPress={handleLogout}>
                                      Logout
                                  </Button>
                              </View>
                          }
                />
            </PaperProvider>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 50,
        marginBottom: 20,
        marginLeft:10
    },
});


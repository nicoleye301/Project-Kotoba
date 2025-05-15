import React, { useEffect, useState } from 'react';
import {SafeAreaView, View, Alert, Platform, StyleSheet, ScrollView} from 'react-native';
import {Text, Button, TextInput, ActivityIndicator,} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

import FriendApi from '@/api/friend';
import UserApi from '@/api/user';
import CapsuleApi from '@/api/capsule';
import Capsule from '@/components/Capsule';
import eventEmitter from '@/utils/eventEmitter';
import { getDisplayName } from '@/utils/displayName';

export default function CapsuleScreen() {
    const [me, setMe] = useState<number | null>(null);
    const [friends, setFriends] = useState<{ id: number; name: string }[]>([]);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [unlockTime, setUnlockTime] = useState<Date>(new Date());
    const [message, setMessage] = useState('');
    const [loadingFriends, setLoadingFriends] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // load current user ID
    useEffect(() => {
        AsyncStorage.getItem('loggedInUserId')
            .then(id => id && setMe(Number(id)))
            .catch(console.error);
    }, []);

    // fetch friends once we know “me”
    useEffect(() => {
        if (me == null) return;
        (async () => {
            try {
                const list = await FriendApi.getFriendList(me);
                const opts: typeof friends = [{ id: me, name: 'Myself' }];
                for (const f of list) {
                    const friendId = f.userId === me ? f.friendId : f.userId;
                    const user = await UserApi.getUserById(friendId);
                    opts.push({
                        id: friendId,
                        name: getDisplayName({ username: user.username }, f.nickname)
                    });
                }
                setFriends(opts);
                setSelectedUser(opts[0].id);
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Could not load friends.');
            } finally {
                setLoadingFriends(false);
            }
        })();
    }, [me]);

    // reload list when an unlock arrives via webSocket
    useEffect(() => {
        const sub = eventEmitter.addListener('capsuleUnlockedExternally', () => {
            setRefreshKey(k => k + 1);
        });
        return () => sub.remove();
    }, []);

    // handlers for date & time pickers
    const onDateChange = (_: any, date?: Date) => {
        if (date) {
            setUnlockTime(prev => {
                const d = new Date(prev);
                d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
                return d;
            });
        }
    };
    const onTimeChange = (_: any, date?: Date) => {
        if (date) {
            setUnlockTime(prev => {
                const d = new Date(prev);
                d.setHours(date.getHours(), date.getMinutes());
                return d;
            });
        }
    };

    // open Android pickers
    const showDatePicker = () => {
        DateTimePickerAndroid.open({
            value: unlockTime,
            onChange: onDateChange,
            mode: 'date',
        });
    };
    const showTimePicker = () => {
        DateTimePickerAndroid.open({
            value: unlockTime,
            onChange: onTimeChange,
            mode: 'time',
            is24Hour: false,
        });
    };

    // schedule button
    const schedule = async () => {
        if (!selectedUser || !message.trim()) {
            return Alert.alert('Validation', 'Pick a recipient and enter a message.');
        }
        setSubmitting(true);
        try {
            await CapsuleApi.createCapsule({
                creatorId: me!,
                targetUserId: selectedUser,
                message,
                unlockTime: unlockTime.toISOString(),
            });
            Alert.alert('Scheduled!', 'Your capsule is set.');
            setMessage('');
            setRefreshKey(k => k + 1);
        } catch (e: any) {
            console.error(e);
            const errMsg = e.response?.data?.message || e.message;
            Alert.alert('Error', errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingFriends) {
        return <ActivityIndicator style={styles.loader} />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <Text>Select Recipient</Text>
                <Picker
                    selectedValue={selectedUser}
                    onValueChange={v => setSelectedUser(v)}
                    style={styles.picker}
                >
                    {friends.map(f => (
                        <Picker.Item key={f.id} label={f.name} value={f.id} />
                    ))}
                </Picker>

                <View style={styles.datetimeRow}>
                    <Button onPress={showDatePicker} style={styles.dtButton}>
                        {unlockTime.toLocaleDateString()}
                    </Button>
                    <Button onPress={showTimePicker} style={styles.dtButton}>
                        {unlockTime.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </Button>
                </View>

                <TextInput
                    label="Secret Message"
                    value={message}
                    onChangeText={setMessage}
                    multiline
                    style={styles.input}
                />

                <Button
                    mode="contained"
                    onPress={schedule}
                    loading={submitting}
                    disabled={submitting}
                >
                    Schedule Capsule
                </Button>
            </View>

            <View style={styles.list}>
                <Text style={styles.listTitle}>Your Capsules</Text>
                <Capsule me={me!} friendId={selectedUser!} refreshKey={refreshKey} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2' },
    form: { padding: 16, backgroundColor: '#fff' },
    picker: { marginVertical: 8 },
    datetimeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    dtButton: { flex: 1, marginHorizontal: 4 },
    input: { marginVertical: 8, height: 80 },
    list: { flex: 1, paddingTop: 12 },
    listTitle: { fontSize: 18, fontWeight: '500', marginLeft: 16 },
    loader: { flex: 1, justifyContent: 'center' },
});

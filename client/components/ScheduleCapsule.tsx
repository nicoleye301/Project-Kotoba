import React, { useState, useEffect } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';
import {
    Text,
    Button,
    TextInput,
    ActivityIndicator
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import CapsuleApi from '@/api/capsule';
import FriendApi from '@/api/friend';
import UserApi from '@/api/user';
import { getDisplayName } from '@/utils/displayName';

interface FriendOption {
    id: number;
    name: string;
}

interface Props {
    // called after a successful schedule to let parent refresh lists
    onScheduled?: () => void;
}

const ScheduleCapsule: React.FC<Props> = ({ onScheduled }) => {
    const [me, setMe] = useState<number|null>(null);
    const [friends, setFriends] = useState<FriendOption[]>([]);
    const [selectedUser, setSelectedUser] = useState<number|null>(null);
    const [unlockTime, setUnlockTime] = useState<Date>(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // load current user ID
    useEffect(() => {
        AsyncStorage.getItem('loggedInUserId')
            .then(id => {
                if (id) setMe(Number(id));
            })
            .catch(console.error);
    }, []);

    // once we know “me”, load actual friend list
    useEffect(() => {
        if (me == null) return;
        (async () => {
            try {
                const list = await FriendApi.getFriendList(me);
                const opts: FriendOption[] = [];
                // schedule a capsule for yourself
                opts.push({ id: me, name: 'Myself' });

                for (const f of list) {
                    // determine the other user’s ID
                    const friendId = (f.userId === me ? f.friendId : f.userId)!;
                    const user = await UserApi.getUserById(friendId);
                    const name = getDisplayName({ username: user.username }, f.nickname);
                    opts.push({ id: friendId, name });
                }

                setFriends(opts);
                setSelectedUser(opts[0].id);
            } catch (e) {
                console.error(e);
                Alert.alert('Error', 'Could not load friends.');
            } finally {
                setLoading(false);
            }
        })();
    }, [me]);

    // date-time picker handler
    const onChangeDate = (_: any, date?: Date) => {
        setShowPicker(Platform.OS === 'ios');
        if (date) setUnlockTime(date);
    };

    // schedule button handler
    const schedule = async () => {
        if (!selectedUser || !message.trim()) {
            return Alert.alert('Validation', 'Please pick a user and enter a message.');
        }
        setSubmitting(true);
        try {
            await CapsuleApi.createCapsule({
                creatorId: me!,
                targetUserId: selectedUser,
                message,
                unlockTime: unlockTime.toISOString()
            });
            Alert.alert('Scheduled', 'Your capsule is on its way!');
            setMessage('');
            onScheduled?.();
        } catch (e: any) {
            console.error(e);
            const errMsg = e.response?.data?.message || e.message;
            Alert.alert('Error', errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <ActivityIndicator style={styles.loading} />;
    }

    return (
        <View style={styles.container}>
            <Text>Select Recipient</Text>
            <Picker
                selectedValue={selectedUser}
                onValueChange={(v) => setSelectedUser(v)}
                style={styles.picker}
            >
                {friends.map(f => (
                    <Picker.Item key={f.id} label={f.name} value={f.id} />
                ))}
            </Picker>

            <Text>Unlock Time</Text>
            <Button
                mode="outlined"
                onPress={() => setShowPicker(true)}
                style={styles.dateButton}
            >
                {unlockTime.toLocaleString()}
            </Button>
            {showPicker && (
                <DateTimePicker
                    value={unlockTime}
                    mode="datetime"
                    display="default"
                    onChange={onChangeDate}
                />
            )}

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
                disabled={submitting}
                loading={submitting}
            >
                Schedule Capsule
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { padding: 16, backgroundColor: '#fff' },
    picker: { marginVertical: 8 },
    dateButton: { marginVertical: 8 },
    input: { marginVertical: 8, height: 80 },
    loading: { flex: 1, justifyContent: 'center' }
});

export default ScheduleCapsule;

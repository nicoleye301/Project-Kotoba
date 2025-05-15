import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Button, Text, Paragraph } from 'react-native-paper';
import CapsuleApi, { Capsule as CapsuleModel } from '@/api/capsule';
import UserApi from '@/api/user';
import eventEmitter from '@/utils/eventEmitter';
import { getDisplayName } from '@/utils/displayName';

interface Props {
    me: number;
}

export default function Capsule({ me }: Props) {
    const [myCapsules, setMyCapsules] = useState<CapsuleModel[]>([]);
    const [readyCapsules, setReadyCapsules] = useState<CapsuleModel[]>([]);
    const [tab, setTab] = useState<'sent' | 'received'>('sent');
    const [sentSubTab, setSentSubTab] = useState<'locked' | 'opened'>('locked');
    const [userNames, setUserNames] = useState<Record<number, string>>({});

    // load scheduled
    useEffect(() => {
        CapsuleApi.fetchByCreator(me).then(setMyCapsules).catch(console.error);
    }, [me]);

    // load received on demand
    useEffect(() => {
        if (tab === 'received') {
            CapsuleApi.fetchReceived(me).then(setReadyCapsules).catch(console.error);
        }
    }, [tab, me]);

    // live unlocks
    useEffect(() => {
        const sub = eventEmitter.addListener('capsuleUnlockedExternally', p => {
            if (p.targetUserId === me) {
                setReadyCapsules(r => [
                    ...r,
                    {
                        id: p.capsuleId,
                        creatorId: p.creatorId,
                        targetUserId: p.targetUserId,
                        message: p.message,
                        unlockTime: p.unlockTime,
                        createdAt: new Date().toISOString(),
                        isUnlocked: true,
                        unlockedAt: p.unlockTime,
                    },
                ]);
            }
        });
        return () => sub.remove();
    }, [me]);

    // fetch display names
    useEffect(() => {
        const ids = new Set<number>();
        myCapsules.forEach(c => ids.add(c.targetUserId));
        readyCapsules.forEach(c => ids.add(c.creatorId));
        ids.forEach(id => {
            if (!userNames[id]) {
                UserApi.getUserById(id)
                    .then(u =>
                        setUserNames(n => ({
                            ...n,
                            [id]: getDisplayName({ username: u.username }, undefined),
                        }))
                    )
                    .catch(console.error);
            }
        });
    }, [myCapsules, readyCapsules]);

    const locked = myCapsules.filter(c => !c.isUnlocked);
    const opened = myCapsules.filter(c => c.isUnlocked);

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
        >
            {/* main tabs */}
            <View style={styles.tabBar}>
                <Button
                    mode={tab === 'sent' ? 'contained' : 'outlined'}
                    onPress={() => setTab('sent')}
                    style={styles.tabButton}
                >
                    Scheduled
                </Button>
                <Button
                    mode={tab === 'received' ? 'contained' : 'outlined'}
                    onPress={() => setTab('received')}
                    style={styles.tabButton}
                >
                    Received
                </Button>
            </View>

            {tab === 'sent' ? (
                <>
                    {/* sub-tabs under Scheduled */}
                    <View style={styles.subTabBar}>
                        <Button
                            mode={sentSubTab === 'locked' ? 'contained' : 'outlined'}
                            onPress={() => setSentSubTab('locked')}
                            style={styles.subTabButton}
                        >
                            Locked
                        </Button>
                        <Button
                            mode={sentSubTab === 'opened' ? 'contained' : 'outlined'}
                            onPress={() => setSentSubTab('opened')}
                            style={styles.subTabButton}
                        >
                            Opened
                        </Button>
                    </View>
                    <Text style={styles.title}>
                        {sentSubTab === 'locked' ? 'Locked Capsules' : 'Opened Capsules'}
                    </Text>
                    {(sentSubTab === 'locked' ? locked : opened).length === 0 ? (
                        <Paragraph>No capsules here.</Paragraph>
                    ) : (
                        (sentSubTab === 'locked' ? locked : opened).map(c => (
                            <TouchableOpacity key={c.id}>
                                <Paragraph>
                                    To {userNames[c.targetUserId] ?? c.targetUserId} @{' '}
                                    {new Date(c.unlockTime).toLocaleString()} —{' '}
                                    {c.isUnlocked ? '🔓' : '🔒'}
                                </Paragraph>
                            </TouchableOpacity>
                        ))
                    )}
                </>
            ) : (
                <>
                    <Text style={styles.title}>Capsules You’ve Received</Text>
                    {readyCapsules.length === 0 ? (
                        <Paragraph>No unlocked capsules yet.</Paragraph>
                    ) : (
                        readyCapsules.map(c => (
                            <View key={c.id} style={styles.capsuleCard}>
                                <Paragraph>
                                    From {userNames[c.creatorId] ?? c.creatorId} @{' '}
                                    {new Date(c.unlockTime).toLocaleString()}
                                </Paragraph>
                                <Paragraph style={styles.message}>"{c.message}"</Paragraph>
                            </View>
                        ))
                    )}
                </>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F2F2F2' },
    tabBar: { flexDirection: 'row', marginBottom: 16 },
    tabButton: { flex: 1, marginHorizontal: 4 },
    subTabBar: { flexDirection: 'row', marginBottom: 8 },
    subTabButton: { flex: 1, marginHorizontal: 4 },
    title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
    capsuleCard: {
        padding: 8,
        marginBottom: 8,
        backgroundColor: '#fff',
        borderRadius: 6,
    },
    message: { fontStyle: 'italic' },
});

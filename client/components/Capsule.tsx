import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    TextInput,
    FlatList,
} from 'react-native';
import { Modal, Card, Button, Text, Paragraph } from 'react-native-paper';
import LottieView from 'lottie-react-native';
import CapsuleApi, { Capsule } from '../api/capsule';

interface Props {
    me: number;        // your user ID
    friendId: number;  // who this capsule is for
}

const Capsule: React.FC<Props> = ({ me, friendId }) => {
    const [visible, setVisible] = useState(false);

    // all capsules you’ve created
    const [myCapsules, setMyCapsules] = useState<Capsule[]>([]);

    // for unlock flow
    const [animatingCapsule, setAnimatingCapsule] = useState<Capsule | null>(null);
    const [unlockedCapsule, setUnlockedCapsule]   = useState<Capsule | null>(null);

    // for scheduling
    const [pendingMsg, setPendingMsg] = useState('');

    // load your created capsules once on mount
    useEffect(() => {
        async function loadMine() {
            try {
                const list = await CapsuleApi.fetchByCreator(me);
                setMyCapsules(list);
            } catch (e) {
                console.error('Failed to load capsules', e);
            }
        }
        loadMine();
    }, [me]);

    // check for any ready-to-unlock capsules
    const openCapsule = async () => {
        setVisible(true);
        setUnlockedCapsule(null);

        try {
            const ready = await CapsuleApi.fetchReady(friendId);
            if (ready.length > 0) {
                setAnimatingCapsule(ready[0]);
            }
        } catch (e) {
            console.error('Failed to fetch ready capsules', e);
        }
    };

    // after animation, show the message
    const onAnimationFinish = () => {
        if (!animatingCapsule) return;
        setUnlockedCapsule(animatingCapsule);
        setAnimatingCapsule(null);
    };

    // schedule a new capsule right now
    const scheduleCapsule = async () => {
        try {
            const newCapsule = await CapsuleApi.createCapsule({
                creatorId: me,
                targetUserId: friendId,
                message: pendingMsg,
                unlockTime: new Date().toISOString(),
            });
            setPendingMsg('');
            // reload your list so the new one appears
            const list = await CapsuleApi.fetchByCreator(me);
            setMyCapsules(list);
        } catch (e) {
            console.error('Failed to schedule capsule', e);
        }
    };

    // tap on one of your capsules to fetch its full details
    const viewCapsule = async (id: number) => {
        try {
            const full = await CapsuleApi.fetchById(id);
            console.log('Full capsule details:', full);
            // optionally display full details somewhere
        } catch (e) {
            console.error('Failed to fetch capsule by id', e);
        }
    };

    const close = () => {
        setVisible(false);
        setAnimatingCapsule(null);
        setUnlockedCapsule(null);
        setPendingMsg('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Capsule Demo</Text>
            <Button mode="contained" onPress={openCapsule} style={styles.openButton}>
                Open Capsule Demo
            </Button>

            <Modal
                visible={visible}
                onDismiss={close}
                contentContainerStyle={styles.modalContainer}
            >
                <Card style={styles.capsuleCard}>

                    {/* list of all capsules user created */}
                    <Text style={styles.sectionTitle}>Your Scheduled Capsules</Text>
                    <FlatList
                        data={myCapsules}
                        keyExtractor={item => item.id.toString()}
                        style={styles.list}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => viewCapsule(item.id)}>
                                <Paragraph>
                                    To {item.targetUserId} @{' '}
                                    {new Date(item.unlockTime).toLocaleString()} —{' '}
                                    {item.isUnlocked ? '🔓' : '🔒'}
                                </Paragraph>
                            </TouchableOpacity>
                        )}
                    />

                    {/* unlock / animation header */}
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Capsule</Text>
                        <TouchableOpacity onPress={close}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>

                    {/* unlock flow */}
                    {animatingCapsule ? (
                        <View style={styles.animationContainer}>
                            <LottieView
                                source={require('../assets/unlock_animation.json')}
                                autoPlay
                                loop={false}
                                speed={2}
                                onAnimationFinish={onAnimationFinish}
                                style={[styles.lottie, { width: 250, height: 250 }]}
                            />
                        </View>
                    ) : unlockedCapsule ? (
                        <>
                            <Text style={styles.secretMessage}>
                                {unlockedCapsule.message}
                            </Text>
                            <Button mode="outlined" style={styles.optionsButton}>
                                Save to Favorite
                            </Button>
                        </>
                    ) : (
                        <>
                            {/* scheduling UI */}
                            <Paragraph style={styles.lockedText}>
                                No capsule to open yet. Schedule one below:
                            </Paragraph>
                            <TextInput
                                style={styles.input}
                                placeholder="Your secret message"
                                value={pendingMsg}
                                onChangeText={setPendingMsg}
                            />
                            <Button
                                mode="contained"
                                onPress={scheduleCapsule}
                                disabled={!pendingMsg.trim()}
                                contentStyle={styles.unlockButtonContent}
                                style={[styles.unlockButton, { marginTop: 12 }]}
                            >
                                Schedule & Unlock Now
                            </Button>
                        </>
                    )}
                </Card>
            </Modal>
        </View>
    );
};

export default Capsule;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    pageTitle: {
        fontSize: 28,
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    openButton: {
        borderRadius: 8,
        backgroundColor: '#2f5476',
    },
    modalContainer: {
        backgroundColor: '#fff',
        margin: 20,
        borderRadius: 12,
        padding: 20,
    },
    capsuleCard: {
        borderRadius: 12,
        padding: 20,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
    },
    list: {
        maxHeight: 150,
        marginBottom: 12,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#555',
    },
    closeText: {
        fontSize: 16,
        color: '#999',
    },
    lockedText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 16,
    },
    unlockButton: {
        alignSelf: 'center',
        borderRadius: 8,
        backgroundColor: '#2f5476',
    },
    unlockButtonContent: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        padding: 8,
        marginHorizontal: 16,
    },
    secretMessage: {
        fontSize: 22,
        fontWeight: '600',
        color: '#222',
        textAlign: 'center',
        marginBottom: 20,
    },
    optionsButton: {
        alignSelf: 'center',
        borderRadius: 8,
        borderColor: '#2f5476',
    },
    optionsButtonContent: {
        paddingVertical: 8,
        paddingHorizontal: 16,
    },
    animationContainer: {
        height: 150,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lottie: {
        width: 150,
        height: 150,
    },
});

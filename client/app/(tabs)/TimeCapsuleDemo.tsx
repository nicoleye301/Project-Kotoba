import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Modal, Card, Button, Text, Paragraph } from 'react-native-paper';
import LottieView from 'lottie-react-native';

const CapsuleDemo = () => {
    // modal visibility state, secret unlocked state, and whether the unlock animation is playing
    const [visible, setVisible] = useState(false);
    const [unlocked, setUnlocked] = useState(false);
    const [animating, setAnimating] = useState(false);

    // open the capsule modal and start locked
    const openCapsule = () => {
        setVisible(true);
        setUnlocked(false);
        setAnimating(false);
    };

    // close the capsule modal and reset state
    const closeCapsule = () => {
        setVisible(false);
        setUnlocked(false);
        setAnimating(false);
    };

    // start the unlock animation
    const handleUnlock = () => {
        setAnimating(true);
    };

    // when the Lottie animation finishes, mark the capsule as unlocked
    const onAnimationFinish = () => {
        setAnimating(false);
        setUnlocked(true);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.pageTitle}>Capsule Demo</Text>
            <Button
                mode="contained"
                onPress={openCapsule}
                contentStyle={styles.openButtonContent}
                style={styles.openButton}
            >
                Open Capsule Demo
            </Button>
            <Modal
                visible={visible}
                onDismiss={closeCapsule}
                contentContainerStyle={styles.modalContainer}
                dismissable
            >
                <Card style={styles.capsuleCard}>
                    <View style={styles.headerRow}>
                        <Text style={styles.headerTitle}>Capsule</Text>
                        <TouchableOpacity onPress={closeCapsule}>
                            <Text style={styles.closeText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                    {animating ? (
                        // unlock animation using LottieView
                        <View style={styles.animationContainer}>
                            <LottieView
                                source={require('./unlock_animation.json')}
                                autoPlay
                                loop={false}
                                speed={2}
                                onAnimationFinish={onAnimationFinish}
                                style={[styles.lottie, { width: 250, height: 250 }]}
                            />
                        </View>
                    ) : !unlocked ? (
                        // locked state view with an Unseal button
                        <>
                            <Paragraph style={styles.lockedText}>
                                This capsule is sealed until 2025-12-31.
                            </Paragraph>
                            <Button
                                mode="contained"
                                onPress={handleUnlock}
                                contentStyle={styles.unlockButtonContent}
                                style={styles.unlockButton}
                            >
                                Unseal Capsule
                            </Button>
                        </>
                    ) : (
                        // unlocked state showing the secret message
                        <>
                            <Text style={styles.secretMessage}>
                                "Hello, future self! Keep believing."
                            </Text>
                            <Button
                                mode="outlined"
                                onPress={() => {}}
                                style={styles.optionsButton}
                                contentStyle={styles.optionsButtonContent}
                            >
                                Save to Favorite
                            </Button>
                        </>
                    )}
                </Card>
            </Modal>
        </View>
    );
};

export default CapsuleDemo;

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
    openButtonContent: {
        paddingVertical: 8,
        paddingHorizontal: 16,
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

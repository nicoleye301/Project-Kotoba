import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "@/components/Avatar";
import {AvatarStructure} from "@/app/conversation"
import {Button} from "react-native-paper";
import {Tictactoe} from "@/api/tictactoe";

type ChatBubbleProps = {
    message: { content: string; sentTime: string };
    isOwn: boolean;
    avatarLoading:boolean;
    avatarStructure: AvatarStructure;
};

type GameBubbleProps = ChatBubbleProps & {
    callbackOnPress:Function;
};

export default function ChatBubble({ message, isOwn, avatarLoading, avatarStructure }: ChatBubbleProps) {
    const date = new Date(message.sentTime);
    const timeString = !isNaN(date.getTime())
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "Invalid Date";

    return (
        <View style={[styles.bubbleContainer, isOwn ? styles.rightAlign : styles.leftAlign]}>
            {!avatarLoading && <Avatar avatarUrl={avatarStructure.url} title={avatarStructure.username}/>}
            {!avatarLoading && <Text>{avatarStructure.username}</Text>
            }
            <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.friendBubble]}>
                <Text style={[styles.messageText, isOwn ? styles.ownText : styles.friendText]}>
                    {message.content}
                </Text>
                <Text style={styles.timestamp}>{timeString}</Text>
            </View>
        </View>
    );
}

export function GameBubble({ message, isOwn, callbackOnPress }: GameBubbleProps) {

    return (
        <View style={[styles.bubbleContainer, isOwn ? styles.rightAlign : styles.leftAlign]}>
            <View style={[styles.bubble, isOwn ? styles.ownBubble : styles.friendBubble]}>
                {/*<Text style={styles.messageText}>{message.content}</Text>*/}
                <View
                    style={[
                        styles.tictactoeGrid,
                        {
                            flexDirection: 'column',
                            aspectRatio: 1,
                            flex: 0.1,
                        },
                    ]}>
                    <View
                        style={[
                            styles.tictactoeGrid,
                            {
                                flexDirection: 'row',
                            },
                        ]}>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 0)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),0)}
                        </Button>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 1)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),1)}
                        </Button>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 2)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),2)}
                        </Button>
                    </View>
                    <View
                        style={[
                            styles.tictactoeGrid,
                            {
                                // Try setting `flexDirection` to `"row"`.
                                flexDirection: 'row',
                            },
                        ]}>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 3)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),3)}
                        </Button>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 4)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),4)}
                        </Button>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 5)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),5)}
                        </Button>
                    </View>
                    <View
                        style={[
                            styles.tictactoeGrid,
                            {
                                // Try setting `flexDirection` to `"row"`.
                                flexDirection: 'row',
                            },
                        ]}>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 6)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),6)}
                        </Button>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 7)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),7)}
                        </Button>
                        <Button mode="contained" onPress={callbackOnPress.bind(message.content, 8)} style={[styles.tictactoeCell,]}>
                            {Tictactoe.symbolAtIndex(Tictactoe.fromString(message.content),8)}
                        </Button>
                    </View>
                </View>
                <Text style={styles.timestamp}>
                    {new Date(message.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bubbleContainer: {
        marginVertical: 4,
        paddingHorizontal: 10,
    },
    leftAlign: {
        alignSelf: "flex-start",
    },
    rightAlign: {
        alignSelf: "flex-end",
    },
    bubble: {
        maxWidth: "80%",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    ownBubble: {
        backgroundColor: "#DCF8C6",
        borderTopRightRadius: 0,
    },
    friendBubble: {
        backgroundColor: "#FFF",
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 16,
    },
    ownText: {
        textAlign: "right",
        color: "#000",
    },
    friendText: {
        textAlign: "left",
        color: "#333",
    },
    timestamp: {
        fontSize: 10,
        color: "#555",
        alignSelf: "flex-end",
        marginTop: 4,
    },
    tictactoeGrid:{
        flex: 1,
        padding: 20,
    },
    tictactoeCell:{
        aspectRatio: 1,
        flex: 1,
        backgroundColor: 'darkorange'
    }
});

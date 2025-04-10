import {Tictactoe} from "@/api/tictactoe";
import {Button} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import React from "react";

type GameProps = {
    message: { content: string; sentTime: string};
    isOwn: boolean;
    callbackOnPress: Function
};

export default function GameBubble({message, isOwn, callbackOnPress}:GameProps){
    return (
        <View style={styles.bubble}>
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
        </View>
    )
}

const styles = StyleSheet.create({
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
    tictactoeGrid:{
        flex: 1,
        padding: 20,
    },
    tictactoeCell:{
        aspectRatio: 1,
        flex: 1,
        backgroundColor: 'darkorange'
    }
})
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
    const board = JSON.parse(message.content).board

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
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 0)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 1)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 2)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                </View>
                <View
                    style={[
                        styles.tictactoeGrid,
                        {
                            flexDirection: 'row',
                        },
                    ]}>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 3)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 4)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 5)}} style={[styles.tictactoeCell,]}>
                        {" "}
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
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 6)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 7)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(board, 8)}} style={[styles.tictactoeCell,]}>
                        {" "}
                    </Button>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    bubble: {
        maxWidth: "50%",
    },
    tictactoeGrid:{
        flex: 1,
    },
    tictactoeCell:{
        justifyContent:"center",
        aspectRatio: 1,
        flex: 1,
        backgroundColor: '#3D9576FF',
        borderRadius: 0,
        borderWidth: 1,
        borderColor: '#FFF',

    }
})
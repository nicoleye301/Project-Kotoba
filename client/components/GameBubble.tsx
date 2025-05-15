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
                        flex: 1,
                    },
                ]}>
                <View
                    style={[
                        styles.tictactoeGrid,
                        {
                            flexDirection: 'row',
                        },
                    ]}>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 0)}} style={[styles.tictactoeCell,]}>
                        {board[0]}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 1)}} style={[styles.tictactoeCell,]}>
                        {board[1]}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 2)}} style={[styles.tictactoeCell,]}>
                        {board[2]}
                    </Button>
                </View>
                <View
                    style={[
                        styles.tictactoeGrid,
                        {
                            flexDirection: 'row',
                        },
                    ]}>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 3)}} style={[styles.tictactoeCell,]}>
                        {board[3]}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 4)}} style={[styles.tictactoeCell,]}>
                        {board[4]}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 5)}} style={[styles.tictactoeCell,]}>
                        {board[5]}
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
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 6)}} style={[styles.tictactoeCell,]}>
                        {board[6]}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 7)}} style={[styles.tictactoeCell,]}>
                        {board[7]}
                    </Button>
                    <Button mode="contained" onPress={()=>{callbackOnPress(message.content, 8)}} style={[styles.tictactoeCell,]}>
                        {board[8]}
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
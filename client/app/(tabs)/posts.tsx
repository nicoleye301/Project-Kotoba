import {View} from "react-native";
import {Appbar} from "react-native-paper";
import React from "react";


export default function posts(){
    return (
        <View>
            <Appbar.Header>
                <Appbar.Content title="Posts" />
            </Appbar.Header>
        </View>
    )
}
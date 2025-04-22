import {Image, StyleSheet, Text, View} from "react-native";
import React from "react";
import Constants from "expo-constants";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function Avatar(props: { avatarUrl: string, title: string }) {
    return (
        props.avatarUrl ? (
            <Image source={{uri: BASE_URL + "/uploads/avatar/" + props.avatarUrl}} style={styles.avatar}/>
        ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                    {props.title ? props.title[0] : "?"}
                </Text>
            </View>
        )
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 24,
        resizeMode: "cover",
        marginRight:10,
        marginLeft:10
    },
    avatarPlaceholder: {
        backgroundColor: "#bbb",
        justifyContent: "center",
        alignItems: "center",
    },
    avatarInitial: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
    },
})
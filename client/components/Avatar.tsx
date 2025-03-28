import {Image, Text, View} from "react-native";
import React from "react";
import {styles} from "@/app/(tabs)/chat"
import Constants from "expo-constants";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

export default function Avatar(props:{avatarUrl:string, title:string}){
    return (
        <View style={styles.avatarContainer}>
            {props.avatarUrl ? (
                <Image source={{ uri: BASE_URL+"/uploads/avatar/"+props.avatarUrl }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={styles.avatarInitial}>
                        {props.title ? props.title[0] : "?"}
                    </Text>
                </View>
            )}
        </View>
    )
}
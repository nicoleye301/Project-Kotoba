import Constants from "expo-constants";
import {Image, StyleSheet} from "react-native";
import React from "react";

// @ts-ignore
const BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

type ImageBubbleProps = {
    message: { content: string; sentTime: string };
};

export default function ImageBubble({message}: ImageBubbleProps) {
    return <Image source={{uri: (BASE_URL + "/uploads/message/" + message.content)}} style={styles.image}/>
}

const styles = StyleSheet.create({
    image: {
        width: 170,
        height: 120,
        borderRadius: 20,
        resizeMode: 'cover',
    },
})

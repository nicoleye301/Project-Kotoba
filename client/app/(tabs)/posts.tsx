import {Button, View, StyleSheet, TextInput, Text} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {Link, router} from "expo-router";
import {useState} from "react";
import PostApi from "@/api/post"
import {Appbar} from "react-native-paper";
import React from "react";
import user from "@/api/user";


export default function posts(){

    const [postContents, setPostContents] = useState("")

    const handlePost = async () => {
        try{

            PostApi.post({user, postContents});
        }
        catch(error){
            console.error(error)
            alert('Failed')
        }
    }

    const handleRetreiveFriendPost = async () => {
        try{
            PostApi.retrievePost({user, });
        }
        catch(error){
            console.error(error)
            alert('Failed')
        }
    }

    return (
        <View style={styles.container}>
            <Text>PostInput</Text>
            <Text >Username:</Text>
            <TextInput
                style={styles.input}
                value={postContents}
                onChangeText={setPostContents}
                placeholder="Type Post Contents"
            />

            <Button title='friendPost' onPress={handlePost}/>

            <Text>PostOutput</Text>
            <Button title={'retrieveFriendPost'} onPress={handleRetreiveFriendPost}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 400,
        margin: 50,
        textAlign: "center",
        fontFamily: 'Arial',
        padding: 20,
        borderRadius: 8,
    },
    input: {}

});

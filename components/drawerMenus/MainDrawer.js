import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import AppData from '../../app.json';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const MainDrawer = props => {
    return (
        <View style={styles.wrapper}>
            <View>
                <TouchableOpacity style={styles.topPadding} onPress={() => props.navigation.navigate("Home")}>
                    <Text style={styles.buttonText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Home</Text>
                </TouchableOpacity>

                <View style={styles.break} />

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("Die Roller")}>
                    <Text style={styles.buttonText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Dice Roller</Text>
                </TouchableOpacity>

                <View style={styles.break} />

                <TouchableOpacity style={styles.button} onPress={() => props.navigation.navigate("RPG Select")}>
                    <Text style={styles.buttonText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>New Character</Text>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={styles.versionText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>App Version: v{AppData.expo.version}</Text>
                <Text style={styles.versionText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Created by Mitch Regan, 2020</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.icrpgInputBG,
        justifyContent: 'space-between',
    },

    topPadding: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.icrpgHighlight,
        paddingTop: 45,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },

    break: {
        backgroundColor: Colors.icrpgHighlight,
        height: 3,
        width: '85%',
        alignSelf: 'center',
        margin: 10,
        //borderRadius: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.icrpgHighlight,
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
    },

    buttonText: {
        fontFamily: Fonts.icrpgFont3,
        fontSize: 18,
        color: Colors.shelf,
        paddingLeft: 15,
    },

    versionText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 11,
        color: Colors.defaultText,
        alignSelf: 'center',
        paddingBottom: 5,
    },
})

export default MainDrawer;
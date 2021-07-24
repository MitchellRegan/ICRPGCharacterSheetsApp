import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ImageBackground } from 'react-native';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const DefaultButton = ({ onPress, buttonText, disabled, style = {} }) => {
    return (
        <TouchableOpacity style={[styles.buttonEnabled, style]} onPress={onPress} disabled={disabled}>
            <ImageBackground style={styles.buttonBG} resizeMode={'stretch'} source={require('../../assets/decals/buttonBG.png')}>
                <Text style={styles.buttonText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{buttonText}</Text>
            </ImageBackground>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonEnabled: {
        alignItems: 'center',
        margin: 3,
    },

    buttonBG: {
        width: '100%',
        alignItems: 'center',
    },

    buttonText: {
        fontFamily: Fonts.icrpgFont3,
        fontSize: 18,
        color: Colors.shelf,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    }
});

export default DefaultButton;
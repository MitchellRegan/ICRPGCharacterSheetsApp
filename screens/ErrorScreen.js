import React from "react";
import { StyleSheet, View, Text, ImageBackground } from "react-native";

import DefaultNavBar from '../components/navBars/DefaultNavBar';

import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

const ErrorScreen = props => {
    return (
        <ImageBackground source={require('../assets/backgrounds/icrpg_background.png')} style={styles.wrapper}>
            <DefaultNavBar navigation={props.navigation} title={"ERROR"}/>

            <View style={{ justifyContent: 'center', marginTop: 30 }}>
                <View style={styles.centerView}>
                    <Text style={styles.header}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>OOPS! Something went wrong...</Text>

                    <Text style={styles.userMessage}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{props.route.params.userMessage}</Text>

                    <Text style={styles.errorMessage}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>"{props.route.params.errorMessage.message}"</Text>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    centerView: {
        alignSelf: 'center',
        width: '100%',
        alignItems: 'center',
    },

    header: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.defaultText,
        fontSize: 24,
        marginBottom: 30,
        width: '70%',
        textAlign: 'center',
    },

    userMessage: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.defaultError,
        fontSize: 16,
        marginBottom: 10,
        width: '90%',
        textAlign: 'center',
    },

    errorMessage: {
        fontFamily: Fonts.icrpgFont1,
        color: Colors.defaultText,
        fontSize: 16,
        marginBottom: 10,
        width: '90%',
        textAlign: 'center',
    },
})

export default ErrorScreen;
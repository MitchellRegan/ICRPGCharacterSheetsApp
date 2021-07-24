import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';

import BackArrowIcon from '../../assets/icons/BackArrow_icon_icrpg.svg';
import HamburgerIcon from '../../assets/icons/Hamburger_icon_icrpg.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const DefaultNavBar = ({ navigation, title = "", disableBack = null }) => {


    return (
        <View style={styles.wrapper}>
            <View style={styles.wrapperContent}>
                {(disableBack == null) && <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                    <BackArrowIcon height={30} width={30} />
                </TouchableOpacity>}
                {(disableBack != null) && <View style={styles.button}>
                    <View style={{height: 30, width: 30}} />
                </View>}

                <Text style={styles.headerText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{title}</Text>

                <TouchableOpacity style={styles.button} onPress={() => navigation.openDrawer()}>
                    <HamburgerIcon height={35} width={35} />
                </TouchableOpacity>
            </View>
            <Image source={require('../../assets/decals/blackBar3.png')} style={styles.inputLine} />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: Colors.icrpgHighlight,
        shadowColor: '#000',
        shadowOffset: { height: 10, width: 10 },
        shadowOpacity: 1.0,
        elevation: 5,
    },

    wrapperContent: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    button: {
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
    },

    headerText: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.shelf,
        fontSize: 18,
    },

    inputLine: {
        position: 'absolute',
        bottom: -2,
        width: '120%',
        alignSelf: 'center',
    }
});

export default DefaultNavBar;
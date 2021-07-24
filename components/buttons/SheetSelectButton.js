import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import AsyncVarNames from '../../constants/AsyncVarNames';

import TableTopGames from '../../enums/shared/tableTopGames';

const SheetSelectButton = ({ navigation, name, date, sheetIndex, className = "", sheetData = {}, style = {} }) => {
    //Function called on button press to navigate to the correct character sheet
    function GoToSheet() {
        AsyncStorage.setItem(AsyncVarNames.selectedSheetIndex, "" + sheetIndex)
            .then(() => {
                navigation.navigate("ICRPG Sheet", { sheetData: sheetData });
            })
            .catch((error) => {
                navigation.navigate("Error", { userMessage: "Could not save ICRPG character sheet index to AsyncStorage.", errorMessage: error })
            })
    }


    return (
        <TouchableOpacity style={[style]} onPress={() => GoToSheet()}>
            <View style={styles.icrpgButton}>
                <Text style={styles.icrpgNameText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{name}</Text>
                <View>
                    <Text style={styles.icrpgGameText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{sheetData.bioForm} {className}</Text>
                    <Text style={styles.icrpgDateText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{date}</Text>
                </View>
                {/*<Image style={{ position: 'absolute', top: 0, left: -2 }} source={require('../../assets/decals/squareBorder_topLeftSmall.png')} />
                <Image style={{ position: 'absolute', bottom: -3, right: -2 }} source={require('../../assets/decals/squareBorder_bottomRightSmall.png')} />*/}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    defaultButton: {
        backgroundColor: Colors.defaultButton,
        borderColor: Colors.defaultBorder,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 4,
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },

    defaultNameText: {
        fontFamily: Fonts.mainFont,
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.defaultText,
    },

    defaultGameText: {
        fontFamily: Fonts.mainFont,
        fontSize: 12,
        fontWeight: 'bold',
        color: Colors.defaultText,
    },

    defaultDateText: {
        fontFamily: Fonts.mainFont,
        fontSize: 12,
        color: Colors.defaultText,
    },

    icrpgButton: {
        backgroundColor: Colors.icrpgInputBG,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 4,
        width: '95%',
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        paddingLeft: 15,
        paddingRight: 15,
    },

    icrpgNameText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 17,
        color: Colors.icrpgText,
    },

    icrpgGameText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 12,
        //fontWeight: 'bold',
        color: Colors.icrpgText,
        alignSelf: 'flex-end',
    },

    icrpgDateText: {
        fontFamily: Fonts.icrpgFont1,
        fontSize: 12,
        color: Colors.icrpgText,
        alignSelf: 'flex-end',
    },
});

export default SheetSelectButton;
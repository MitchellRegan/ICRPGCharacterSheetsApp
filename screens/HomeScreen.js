import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList, ImageBackground } from "react-native";
import AsyncStorage from '@react-native-community/async-storage';
import * as Font from 'expo-font';

import DefaultNavBar from '../components/navBars/DefaultNavBar';
import DefaultButton from '../components/buttons/DefaultButton';
import SheetSelectButton from '../components/buttons/SheetSelectButton';
import ContentBox from '../components/icrpg/ContentBox';

import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import AsyncVarNames from '../constants/AsyncVarNames';

const HomeScreen = props => {
    const [stateVars, setStateVars] = useState({
        charSheetArray: null,
        initialLoadComplete: false,
    });

    //Function called when this screen loads to get all of the user's character sheets
    function RetrieveCharSheets(override_ = false) {
        //If the initial load has been completed, nothing happens
        if (stateVars.initialLoadComplete && !override_) {
            return;
        }

        try {
            AsyncStorage.getItem(AsyncVarNames.charSheetsArray)
                .then((data) => {
                    data = JSON.parse(data);

                    setStateVars((prevState) => {
                        return ({
                            ...prevState,
                            charSheetArray: data,
                            initialLoadComplete: true
                        });
                    });
                })
                .catch((error) => {
                    props.navigation.navigate("Error", { userMessage: "Error retrieving character sheets from AsyncStorage", errorMessage: error });
                })
        }
        catch (error) {
            props.navigation.navigate("Error", { userMessage: "Error accessing AsyncStorage Library", errorMessage: error });
        }
    }


    //Creating a useEffect to add a navigation listener for when this screen is in focus so that it can keep up-to-date displays
    useEffect(() => {
        const inFocus = props.navigation.addListener('focus', () => {
            RetrieveCharSheets(true);
        });

        return inFocus;
    }, [props.navigation])

    let [fontsLoaded] = Font.useFonts({
        'ComicNeue-Bold': require('../assets/fonts/ComicNeue-Bold.ttf'),
        'TestFont': 'https://rsms.me/inter/font-files/Inter-SemiBoldItalic.otf?v=3.12'
    });



    return (
        <ImageBackground style={{ flex: 1 }} source={require('../assets/backgrounds/icrpg_background.png')}>
            <DefaultNavBar navigation={props.navigation} title={"HOME"} disableBack={true} />

            <View style={{ justifyContent: 'center' }}>
                <View style={styles.centerView}>
                    <Text style={styles.header}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>ICRPG Character Sheets</Text>

                    <DefaultButton buttonText={'DICE ROLLER'} onPress={() => props.navigation.navigate("Die Roller")} style={styles.button} />
                    <DefaultButton buttonText={'NEW CHARACTER'} onPress={() => props.navigation.navigate("RPG Select")} style={styles.button} />

                    <Text style={styles.characterText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Characters</Text>

                    <ContentBox style={styles.contentBox}>
                        {(stateVars.charSheetArray != null && stateVars.charSheetArray.length > 0) && <FlatList
                            style={styles.flatList}
                            initialScrollIndex={0}
                            data={stateVars.charSheetArray}
                            keyExtractor={(itemData, index) => index.toString()}
                            renderItem={itemData => {
                                return (<SheetSelectButton
                                    name={itemData.item.name}
                                    date={itemData.item.createdDate}
                                    className={itemData.item.class}
                                    sheetData={itemData.item}
                                    sheetIndex={itemData.index}
                                    navigation={props.navigation}
                                />);
                            }}
                        />}
                        {(stateVars.charSheetArray == null || stateVars.charSheetArray.length == 0) && <Text style={styles.noCharsText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>- No Character sheets -</Text>}
                    </ContentBox>
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.defaultBG,
    },

    centerView: {
        alignSelf: 'center',
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
    },

    header: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.defaultText,
        fontSize: 28,
        marginBottom: 30,
        width: '70%',
        textAlign:'center',
    },

    button: {
        width: '70%',
    },

    buttonText: {
        fontFamily: Fonts.mainFont,
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.defaultText,
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },

    characterText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 20,
        color: Colors.icrpgText,
        marginTop: 15,
    },

    contentBox: {
        width: '90%',
        borderRadius: 15,
        paddingRight: 10,
        paddingLeft: 10,
        minHeight: 80,
        maxHeight: '50%',
        
    },

    flatList: {
        flexGrow: 1,
        marginBottom: 15,
        marginTop: 10,
    },

    noCharsText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 16,
        color: Colors.icrpgText,
        alignSelf: 'center',
        flex: 1,
        textAlignVertical: 'center',
    },
})

export default HomeScreen;
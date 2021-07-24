import React, { useState } from "react";
import { StyleSheet, View, Text, Picker, Alert, TextInput, ImageBackground} from "react-native";
import AsyncStorage from '@react-native-community/async-storage';

import DefaultNavBar from '../components/navBars/DefaultNavBar';
import DefaultButton from '../components/buttons/DefaultButton';

import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import AsyncVarNames from '../constants/AsyncVarNames';
import TableTopGames from '../enums/shared/tableTopGames';

import EmptyICRPGChar from '../functions/emptyCharacter/EmptyICRPGCharObj';


const RPGSelectScreen = props => {
    const [stateVars, setStateVars] = useState({
        charName: "",
        charClass: "",
        bioForm: "",
        story: "",
        selectedGame: TableTopGames.ICRPG,
        showError: false
    });


    //Function called from DefaultButton to create the character sheet
    function CreateSheet() {
        //If there's no character name, we can't make this character sheet yet
        if (stateVars.charName == "" || stateVars.charClass == "" || stateVars.bioForm == "") {
            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    showError: true
                });
            });

            return;
        }

        //Variable to hold the character sheet when it is created
        var newChar = null;

        switch (stateVars.selectedGame) {
            case TableTopGames.ICRPG:
                newChar = EmptyICRPGChar.create(stateVars.charName, stateVars.charClass, stateVars.bioForm, stateVars.story);
                break;

            default:
                props.navigation.navigate("Error", { userMessage: "Error creating character sheet for unknown game ID", errorMessage: {TypeError: "RPGSelectScreen.CreateSheet, selected gameID is invalid."} });
                break;
        }

        if (newChar == null) {
            return;
        }

        try {
            AsyncStorage.getItem(AsyncVarNames.charSheetsArray)
                .then((dataArray) => {
                    dataArray = JSON.parse(dataArray);

                    //If there are no character sheets, we have to make an array to hold the sheets
                    if (dataArray == null) {
                        dataArray = [newChar];
                    }
                    //If there is an array of character sheets, we append this new sheet to the array
                    else {
                        dataArray = [newChar, ...dataArray];
                    }

                    //Saving the new array of character sheets
                    AsyncStorage.setItem(AsyncVarNames.charSheetsArray, JSON.stringify(dataArray))
                        .then(() => {
                            setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    charName: "",
                                    charClass: "",
                                    bioForm: "",
                                    story: "",
                                    showError: false
                                });
                            });
                            props.navigation.navigate("Home", { numSheets: dataArray.length });
                        })
                        .catch((error) => {
                            props.navigation.navigate("Error", { userMessage: "Error saving the new character sheet.", errorMessage: error });
                        })
                })
                .catch((error) => {
                    props.navigation.navigate("Error", { userMessage: "Error accessing the list of saved character sheets", errorMessage: error });
                })
        }
        catch (error) {
            props.navigation.navigate("Error", { userMessage: "Unknown error accessing AsyncStorage Library", errorMessage: error });
        }
    }



    return (
        <ImageBackground source={require('../assets/backgrounds/icrpg_background.png')} style={styles.wrapper}>
            <DefaultNavBar navigation={props.navigation} title={"NEW CHARACTER"} />

            <Text style={styles.header}
                allowFontScaling={Fonts.allowScaling}
                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Create Your Character</Text>

            <View style={styles.inputOutline}>
                {/*Name*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Name:</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder={"Name"}
                        value={stateVars.charName}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        onChangeText={(newText) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                charName: newText
                            })
                        })}
                    />
                </View>
                {(stateVars.showError && stateVars.charName == "") && <Text style={styles.errorText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>*Please enter a name for the character</Text>}

                {/*Class*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Class:</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder={"Class"}
                        value={stateVars.charClass}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        onChangeText={(newText) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                charClass: newText
                            })
                        })}
                    />
                </View>
                {(stateVars.showError && stateVars.charClass == "") && <Text style={styles.errorText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>*Please enter a class for the character</Text>}

                {/*Bio-Form*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Bio-Form:</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder={"Bio-Form"}
                        value={stateVars.bioForm}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        onChangeText={(newText) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                bioForm: newText
                            })
                        })}
                    />
                </View>
                {(stateVars.showError && stateVars.bioForm == "") && <Text style={styles.errorText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>*Please enter a bio-form for the character</Text>}

                {/*Story*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Story:</Text>
                    <TextInput
                        style={styles.inputText}
                        placeholder={"Story"}
                        value={stateVars.story}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        onChangeText={(newText) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                story: newText
                            })
                        })}
                    />
                </View>

                <DefaultButton buttonText={'CREATE CHARACTER'} onPress={() => CreateSheet()} style={styles.button}/>
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
        color: Colors.icrpgText,
        fontSize: 22,
        marginBottom: 15,
        textAlign: 'center',
        alignSelf: 'center',
        width: '90%',
        marginTop: 30,
    },

    inputOutline: {
        alignSelf: 'center',
        width: '90%',
    },

    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: 10,
    },

    inputHeader: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 18,
    },

    inputText: {
        fontFamily: Fonts.icrpgFont1,
        color: Colors.icrpgText,
        backgroundColor: Colors.icrpgInputBG,
        borderRadius: 6,
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        paddingLeft: 5,
    },

    errorText: {
        fontFamily: Fonts.mainFont,
        color: Colors.defaultError,
        fontSize: 12,
        alignSelf: 'center',
        marginBottom: 10,
    },

    button: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
})

export default RPGSelectScreen;
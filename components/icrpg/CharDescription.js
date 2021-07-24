import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import ContentBox from './ContentBox.js';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';
import QuestionIcon from '../../assets/icons/Question_icon.svg';
import HeroCoinActiveIcon from '../../assets/icons/HeroCoinActive_icon2.svg';
import HeroCoinDisabledIcon from '../../assets/icons/HeroCoinDisabled_icon.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const CharDescription = forwardRef(({ onUpdate, navigation, portraitURI = "", name = "", charClass = "", bioForm = "", story = "", heroCoin = false }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return stateVars;
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        portraitURI: portraitURI,
        name: name,
        class: charClass,
        bioForm: bioForm,
        story: story,
        heroCoin: heroCoin,
        viewDescription: true,
        requireUpdate: false
    });
    //Const var to use as a component key for TextInputs to mitigate an error where they're sometimes created with duplicate keys
    const randTextKey = 1000;


    //Function called whenever this script has had a change that requires saving character data
    function UpdateCharacter() {
        if (!stateVars.requireUpdate) {
            return;
        }

        //Using the SaveData async function to let us know when the stateVars are done updating so the parent component can update
        SaveData()
            .then(() => {
                onUpdate();
            })
            .catch((error) => {
                navigation.navigate("Error", { userMessage: "An error occurred when trying to update the ICRPG character description.", errorMessage: error });
            })
    }
    UpdateCharacter();


    //Async function to tell the component that we're done updating
    async function SaveData() {
        let returnData = setStateVars((prevState) => {
            return ({
                ...prevState,
                requireUpdate: false
            });
        });

        return returnData;
    }


    //Function called from TouchableOpacity to inform the user what Hero Coins do
    function HeroCoinInfoPopup() {
        Alert.alert("Hero Coins",
            "Hero coins are awarded to players at the GM's discretion, up to a maximum of 1 coin per character. \n\nA Hero Coin can be used in the following ways: "
            + "\n- Turn in your Hero Coin to re-roll any die roll"
            + "\n- Turn in your Hero Coin to add a D12 to any die roll"
            + "\n- Give your Hero Coin to another player at any time"
        );
    }


    //Function called from TouchableOpacity to upload the user's profile picture
    GetPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

        if (status !== 'granted') {
            Alert.alert('Sorry, this app need camera roll permissions to make this work!');
        }
        else {
            PickImage();
        }
    };


    //Function called from GetPermissionAsync to open the image picker
    PickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                maxWidth: 1000,
                madHeight: 1000,
                base64: true,
            });

            if (!result.cancelled) {
                //setProfilePic(result);
                setStateVars((prevState) => {
                    return ({
                        ...prevState,
                        portraitURI: result.uri,
                        requireUpdate: true
                    });
                });
            }
        } catch (error) {
            navigation.navigate("Error", { userMessage: "An error occurred while selecting the ICRPG character portrait image.", errorMessage: error });
        }
    };


    //Function called from TouchableOpacity to prompt the removal of the portrait image
    function PromptDeletePortrait() {
        Alert.alert("Delete Portrait", "Are you sure?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "OK", onPress: () => setStateVars((prevState) => {
                        return ({
                            ...prevState,
                            portraitURI: "",
                            requireUpdate: true
                        });
                    })
                }
            ]
        );
    }



    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setStateVars((prevState) => {
                return ({
                    ...prevState,
                    viewDescription: !stateVars.viewDescription
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Description</Text>
                {(stateVars.viewDescription) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewDescription) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewDescription) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar1.png')} />}

            {(stateVars.viewDescription) && <ContentBox style={styles.dropdownContent} topRight={true}>
                {/*Portrait*/}
                <View style={styles.portraitView}>
                    {/*No Portrait*/}
                    {(stateVars.portraitURI == null || stateVars.portraitURI == "") && <View>
                        <TouchableOpacity style={styles.portraitButton} onPress={() => GetPermissionAsync()}>
                            <Text style={styles.portraitButtonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Upload Character Portrait</Text>
                        </TouchableOpacity>
                    </View>}

                    {/*Portrait Exists*/}
                    {(stateVars.portraitURI != null && stateVars.portraitURI != "") && <View>
                        <ImageBackground source={{ uri: stateVars.portraitURI }} style={styles.portrait} >
                            <Image source={require('../../assets/decals/portraitBorder2.png')} style={styles.portraitBorder} />
                        </ImageBackground>

                        <View style={styles.portraitButtonRow}>
                            <TouchableOpacity style={styles.portraitButton} onPress={() => GetPermissionAsync()}>
                                <Text style={styles.portraitButtonText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Change Portrait</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.portraitButton} onPress={() => PromptDeletePortrait()}>
                                <Text style={styles.portraitButtonText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Delete Portrait</Text>
                            </TouchableOpacity>
                        </View>
                    </View>}
                </View>

                {/*Name*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Name:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={stateVars.name}
                        placeholder={"Character Name"}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 1)}
                        onChangeText={(newText_) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                name: newText_,
                                requireUpdate: true
                            })
                        })}
                    />
                </View>

                {/*Class*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Class:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={stateVars.class}
                        placeholder={"Class"}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 2)}
                        onChangeText={(newText_) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                requireUpdate: true,
                                class: newText_
                            })
                        })}
                    />
                </View>

                {/*BioForm*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Bio-Form:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={stateVars.bioForm}
                        placeholder={"Bio-Form"}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 3)}
                        onChangeText={(newText_) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                requireUpdate: true,
                                bioForm: newText_
                            })
                        })}
                    />
                </View>

                {/*Story*/}
                <View style={styles.inputRow}>
                    <Text style={styles.inputHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Story:</Text>
                    <TextInput
                        style={styles.textInput}
                        value={stateVars.story}
                        placeholder={"Story"}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 4)}
                        onChangeText={(newText_) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                requireUpdate: true,
                                story: newText_
                            })
                        })}
                    />
                </View>

                {/*Hero Coin*/}
                <View style={styles.heroCoinRow}>
                    <View style={styles.heroCoinGroup}>
                        <Text style={styles.inputHeader}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Hero Coin:</Text>

                        <TouchableOpacity style={styles.heroCoinIcon} onPress={() => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                heroCoin: !stateVars.heroCoin,
                                requireUpdate: true
                            });
                        })}>
                            {(stateVars.heroCoin) && <HeroCoinActiveIcon height={35} width={35} />}
                            {(!stateVars.heroCoin) && <HeroCoinDisabledIcon height={35} width={35} />}
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.questionIcon} onPress={() => HeroCoinInfoPopup()}>
                        <QuestionIcon height={15} width={15} />
                    </TouchableOpacity>
                </View>
            </ContentBox>}
        </View>
    );
})

const styles = StyleSheet.create({
    wrapper: {
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 20,
        paddingBottom: 10,
    },

    headerButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 5,
        marginBottom: 8,
        paddingLeft: 15,
        paddingRight: 15,
    },

    headerBG: {
        position: 'absolute',
    },

    header: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.shelf,
        fontSize: 18,
        textAlign: 'center',
        paddingLeft: 5,
    },

    dropdownContent: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },

    portraitButtonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 5,
    },

    portraitButton: {
        alignSelf: 'center',
        borderColor: Colors.icrpgText,
        borderRadius: 10,
        borderWidth: 1,
        marginTop: 5,
        marginBottom: 10,
        padding: 5,
    },

    portraitButtonText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgHeaderText,
        fontSize: 14,
    },

    portrait: {
        alignSelf: 'center',
        width: 150,
        height: 150,
        borderColor: 'black',
        borderWidth: 2,
        margin: 5,
    },

    portraitBorder: {
        alignSelf: 'center',
        width: 164,
        height: 164,
        top: -8
    },

    inputRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        marginBottom: 5,
        borderBottomColor: Colors.icrpgText,
        borderBottomWidth: 1,
    },

    inputHeader: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgHeaderText,
        fontSize: 18,
    },

    textInput: {
        fontFamily: Fonts.icrpgFont1,
        color: Colors.icrpgText,
        fontSize: 16,
        backgroundColor: Colors.icrpgInputBG,
        textAlignVertical: 'center',
        marginLeft: 5,
        marginRight: 5,
        paddingLeft: 5,
        flex: 1,
    },

    heroCoinRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    heroCoinGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    heroCoinIcon: {
        paddingLeft: 10,
    },

    questionIcon: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingRight: 3,
        alignItems: 'center',
    },

    redBar: {
        alignSelf: 'center',
        width: '100%',
        marginBottom: 5,
    },

    collapsedImage: {
        marginTop: 10,
        alignSelf: 'center',
    }
});

export default CharDescription;
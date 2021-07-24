import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, ImageBackground, LogBox, Alert, Linking } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import DefaultNavBar from '../../components/navBars/DefaultNavBar';
import DefaultButton from '../../components/buttons/DefaultButton';
import CharDescription from '../../components/icrpg/CharDescription';
import CharHealthAndArmor from '../../components/icrpg/CharHealthAndArmor';
import CharStats from '../../components/icrpg/CharStats';
import CharEffort from '../../components/icrpg/CharEffort';
import EquippedGear from '../../components/icrpg/EquippedGear';
import ItemList from '../../components/icrpg/ItemList';
import Mastery from '../../components/icrpg/Mastery';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import AsyncVarNames from '../../constants/AsyncVarNames';
import DeleteCharSheet from '../../functions/sheetData/DeleteCharSheet';
import SaveCharSheet from '../../functions/sheetData/SaveCharSheet';

const ICRPGSheetScreen = props => {
    //Disabling the warning for using a flatlist inside a scrollview
    LogBox.ignoreLogs(["VirtualizedLists", "YellowBox has been replaced"]);

    const [charData, setCharData] = useState(null);
    const charDescriptionRef = useRef();
    const charHealthRef = useRef();
    const charStatsRef = useRef();
    const charEffortRef = useRef();
    const lootRef = useRef();
    const abilitiesRef = useRef();
    const powersRef = useRef();
    const augmentsRef = useRef();
    const notesRef = useRef();
    const masteryRef = useRef();

    const [stateVars, setStateVars] = useState({
        updateAbilityScoreKey: ("" + Math.random()),
        loading: true,
        couldntLoad: false,
    })

    //Creating a useEffect to add a navigation listener for when this screen is in focus so that it can keep up-to-date displays
    useEffect(() => {
        const inFocus = props.navigation.addListener('focus', () => {
            //Making sure the "Loading" screen is shown first-thing while we wait for the data to be retrieved
            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    loading: true
                })
            })

            //Getting the selected sheet index from asyncstorage that was saved by SheetSelectButton.js
            AsyncStorage.getItem(AsyncVarNames.selectedSheetIndex)
                .then((index_) => {
                    //Getting the array of character sheets to pull data from
                    AsyncStorage.getItem(AsyncVarNames.charSheetsArray)
                        .then((data) => {
                            data = JSON.parse(data);

                            //Using the saved sheet index to get the correct character from our array
                            var selectedChar = data[parseInt(index_)];
                            setCharData(selectedChar);

                            //Removing the loading text to display the character info
                            setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    updateAbilityScoreKey: ("" + Math.random()),
                                    loading: false,
                                    couldntLoad: false
                                })
                            })
                        })
                        .catch((error) => {
                            //Making sure the error text is displayed so that the user will know something's wrong
                            setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    couldntLoad: true
                                })
                            })
                            props.navigation.navigate("Error", { userMessage: "Error retrieving character sheets from AsyncStorage", errorMessage: error });
                        })
                })
        });

        return inFocus;
    }, [props.navigation])


    //Function called from child components to tell this page to save the user data
    function SaveChanges() {
        var newCharData = RetrieveData();
        //Checking if there were any updates to the character ability scores
        var abilitiesUpdated = (newCharData.abilityScores != charData.abilityScores);
        //Checking if there were any updates to the loot bonuses for ability scores
        var lootDiff = (newCharData.lootBonuses.str != charData.lootBonuses.str)
                    || (newCharData.lootBonuses.dex != charData.lootBonuses.dex)
                    || (newCharData.lootBonuses.con != charData.lootBonuses.con)
                    || (newCharData.lootBonuses.int != charData.lootBonuses.int)
                    || (newCharData.lootBonuses.wis != charData.lootBonuses.wis)
                    || (newCharData.lootBonuses.cha != charData.lootBonuses.cha);

        SaveCharSheet.saveCharacter(newCharData, newCharData.sheetID)
            .then((data) => {
                if (!data.wasSaved) {
                    Alert.alert("There was an error saving the character", data.errorMessage);
                }
                else {
                    if (abilitiesUpdated || lootDiff) {
                        UpdateCharData(newCharData)
                            .then(() => {
                                //Changing the updateAbilityScoreKey which forces components that use it to update
                                setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        updateAbilityScoreKey: ("" + Math.random())
                                    })
                                })
                            })
                            .catch((error) => {
                                Alert.alert("There was an unknown error updating Ability Scores", "ICRPGSheetScreen.SaveChanges promise catch from SaveCharSheet.updateCharData");
                            })
                    }
                }
            })
            .catch((error) => {
                Alert.alert("There was an unknown error saving the character", "ICRPGSheetScreen.SaveChanges promise catch from SaveCharSheet.saveCharacter");
            })
    }


    //Function called from SaveChanges to update the charData variable and refresh components that need the updated data
    async function UpdateCharData(newCharData_) {
        let tempVar = setCharData(newCharData_);
        return tempVar;
    }


    //Function called from UpdateCharacter to return the new character data from our components
    function RetrieveData() {
        var description = charDescriptionRef.current.RetrieveData();
        var stats = charStatsRef.current.RetrieveData();
        var health = charHealthRef.current.RetrieveData();
        var loot = lootRef.current.RetrieveData();
        var abilities = abilitiesRef.current.RetrieveData();
        var effort = charEffortRef.current.RetrieveData();
        var powers = powersRef.current.RetrieveData();
        var augments = augmentsRef.current.RetrieveData();
        var notes = notesRef.current.RetrieveData();
        var mastery = masteryRef.current.RetrieveData();

        var newChar = {
            "sheetID": charData.sheetID,
            "gameID": charData.gameID,
            "createdDate": charData.createdDate,

            "portraitURI": description.portraitURI,
            "name": description.name,
            "class": description.class,
            "bioForm": description.bioForm,
            "story": description.story,
            "heroCoin": description.heroCoin,

            "hitPoints": {
                "current": health.current,
                "max": health.max,
                "deathCount": health.deathCount
            },
            "armor": health.armor,

            "abilityScores": stats.abilityScores,

            "effort": effort.effort,

            "lootBonuses": {
                "str": stats.lootBonuses.str,
                "dex": stats.lootBonuses.dex,
                "con": stats.lootBonuses.con,
                "int": stats.lootBonuses.int,
                "wis": stats.lootBonuses.wis,
                "cha": stats.lootBonuses.cha,
                "armor": health.lootBonus,
                "basicEffort": effort.lootBonuses.basicEffort,
                "weaponDamage": effort.lootBonuses.weaponDamage,
                "gunDamage": effort.lootBonuses.gunDamage,
                "magicEffect": effort.lootBonuses.magicEffect,
                "ultimate": effort.lootBonuses.ultimate
            },

            "loot": loot.gear,
            "coin": loot.coin,

            "abilities": abilities,
            "powers": powers,
            "augments": augments,
            "notes": notes,

            "mastery": mastery
        };

        return newChar;
    }


    //Function called from TouchableOpacity to prompt the user if they really want to delete
    function PromptDelete() {
        Alert.alert("Are you sure you want to delete this character sheet?", charData.name + " will be deleted. This cannot be undone.",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => DeleteCharacter()
                }
            ]);
    }


    //Function called from the alert in PromptDelete to delete this selected character
    function DeleteCharacter() {
        var charName = charData.name;

        DeleteCharSheet.deleteCharacter(charData.sheetID, charData.name, charData.gameID)
            .then((data) => {
                //Displaying an error message if the sheet couldn't be deleted
                if (!data.wasDeleted) {
                    Alert.alert(charName + " couldn't be deleted", data.errorMessage,
                        [
                            {
                                text: "Ok",
                                style: "cancel"
                            }
                        ]);
                }
                //If the delete worked we need to go back to the home page
                else {
                    Alert.alert(charName + " was deleted");
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: "Home" }]
                    });
                    //props.navigation.navigate({ charDeleted: true, numSheets: 0 });
                    //setCharData(null);
                }
            })
            .catch((error) => {
                props.navigation.navigate("Error", { userMessage: "Unknown error deleting ICRPG character.", errorMessage: error })
            })
    }



    return (
        <ImageBackground style={{ flex: 1 }} source={require('../../assets/backgrounds/icrpg_background.png')}>
            <DefaultNavBar navigation={props.navigation} title={"CHARACTER SHEET"} />

            <ScrollView style={styles.wrapper}>
                {(stateVars.loading && !stateVars.couldntLoad) && <View style={styles.loadingView}>
                    <Text style={styles.loadingText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Loading....</Text>
                </View>}

                {(stateVars.loading && stateVars.couldntLoad) && <View style={styles.loadingView}>
                    <Text style={styles.errorText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>There was an error loading this character sheet.</Text>
                </View>}

                {(!stateVars.loading && charData != null) && <View style={styles.topPadding}>
                    <CharDescription
                        portraitURI={charData.portraitURI}
                        name={charData.name}
                        charClass={charData.class}
                        bioForm={charData.bioForm}
                        story={charData.story}
                        heroCoin={charData.heroCoin}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={charDescriptionRef}
                        key={"" + Math.random()}
                    />
                    <CharHealthAndArmor
                        currentHP={charData.hitPoints.current}
                        maxHP={charData.hitPoints.max}
                        deathCount={charData.hitPoints.deathCount}
                        armor={charData.armor}
                        conTotal={charData.abilityScores.con + charData.lootBonuses.con}
                        lootBonus={charData.lootBonuses.armor}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={charHealthRef}
                        key={stateVars.updateAbilityScoreKey}
                    />
                    <CharStats
                        abilityScores={charData.abilityScores}
                        armor={charData.armor}
                        lootBonuses={charData.lootBonuses}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={charStatsRef}
                        key={"" + Math.random()}
                    />
                    <CharEffort
                        effort={charData.effort}
                        lootBonuses={charData.lootBonuses}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={charEffortRef}
                        key={"" + Math.random()}
                    />
                    <EquippedGear
                        equipmentArray={charData.loot}
                        coins={charData.coin}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={lootRef}
                        key={"" + Math.random()}
                    />
                    <ItemList
                        title={"Abilities"}
                        itemName={"Ability"}
                        itemArray={charData.abilities}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={abilitiesRef}
                        key={"" + Math.random()}
                    />
                    <ItemList
                        title={"Powers"}
                        itemName={"Power"}
                        itemArray={charData.powers}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={powersRef}
                        key={"" + Math.random()}
                    />
                    <ItemList
                        title={"Augments"}
                        itemName={"Augment"}
                        itemArray={charData.augments}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={augmentsRef}
                        key={"" + Math.random()}
                    />
                    <Mastery
                        currentCount={charData.mastery.currentCount}
                        masteriesCompleted={charData.mastery.masteriesCompleted}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={masteryRef}
                        key={"" + Math.random()}
                    />
                    <ItemList
                        title={"Game Notes"}
                        itemName={"Note"}
                        itemArray={charData.notes}
                        onUpdate={() => SaveChanges()}
                        navigation={props.navigation}
                        ref={notesRef}
                        key={"" + Math.random()}
                    />

                    <DefaultButton style={styles.deleteButton} onPress={() => PromptDelete()} buttonText={"Delete Character"}/>

                    <View style={styles.infoWrapper}>
                        <Text style={styles.infoText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontMultiplier}
                        >
                            This character sheet is based on the 2020{' '}
                            <Text
                                style={styles.infoLinkText}
                                onPress={() => Linking.openURL('https://c0898056-b072-499e-b62b-4de05286ce6d.filesusr.com/ugd/62a178_2eb70f6f8ff049089e177cb6e483ed3b.pdf')}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontMultiplier}
                            >
                                Quickstart 2nd edition PDF
                            </Text>
                            {' '}of ICRPG. For more information about ICRPG visit the{' '}
                            <Text
                                style={styles.infoLinkText}
                                onPress={() => Linking.openURL('https://www.icrpg.com/')}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontMultiplier}
                            >
                                official ICRPG website.
                            </Text>
                        </Text>
                    </View>
                </View>}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },

    topPadding: {
        paddingTop: 20
    },

    deleteButton: {
        width: '60%',
        alignSelf: 'center',
        marginTop: 10
    },

    deleteText: {
        fontFamily: Fonts.icrpgFont3,
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
        padding: 8,
    },

    infoWrapper: {
        alignItems: 'center',
        padding: 10,
    },

    infoText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 12,
        color: Colors.icrpgText
    },

    infoLinkText: {
        fontFamily: Fonts.icrpgFont1,
        fontSize: 12,
        color: Colors.defaultTextLink
    },

    loadingView: {
        padding: 30,
        alignItems: 'center',
        marginTop: 100,
    },

    loadingText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 26,
        textAlign: 'center',
        color: Colors.icrpgText
    },

    errorText: {
        fontFamily: Fonts.icrpgFont1,
        fontSize: 18,
        fontWeight: "bold",
        textAlign: 'center',
        color: Colors.defaultError
    },
});

export default ICRPGSheetScreen;
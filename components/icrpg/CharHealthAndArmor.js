import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

import ContentBox from './ContentBox.js';
import DiceRoller from '../../functions/dice/DiceRoller';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';
import D20Icon from '../../assets/icons/D20_icon_icrpg.svg';
import QuestionIcon from '../../assets/icons/Question_icon.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const CharHealthAndArmor = forwardRef(({ onUpdate, currentHP, maxHP, armor, conTotal, lootBonus, navigation, deathCount = 0 }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return {
                    current: stateVars.currentHP,
                    max: stateVars.maxHP,
                    deathCount: stateVars.deathCount,
                    armor: stateVars.armor,
                    lootBonus: stateVars.lootBonus
                };
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        currentHP: currentHP,
        maxHP: maxHP,
        deathCount: deathCount,
        armor: armor,
        conTotal: conTotal,
        lootBonus: lootBonus,
        viewHealth: true,
        requireUpdate: false,
        tempNumberInput: "",
        /*ID for which input field is currently being edited
         * 0: Nothing being edited
         * 1: Current HP
         * 2: Max HP
         * 3: Death Counter
         * 4: Armor Bonus
         */
        editNumberID: 0 
    });
    //Const var to use as a component key for TextInputs to mitigate an error where they're sometimes created with duplicate keys
    const randTextKey = 1100;


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
                navigation.navigate("Error", { userMessage: "An error occurred when trying to update the ICRPG character health.", errorMessage: error });
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


    //Function called from the current HP TextInput to find the number of turns left on the death counter
    function GetDeathCounter() {
        var counter = DiceRoller.roll(4);

        if (counter > 1) {
            Alert.alert("You are dying!", "A D4 was rolled and you have " + counter + " turns to roll a natural 20 to stay alive or be stabilized by an ally's INT or WIS roll.");
        }
        else {
            Alert.alert("You are dying!", "A D4 was rolled and you have " + counter + " turn to roll a natural 20 to stay alive or be stabilized by an ally's INT or WIS roll.");
        }
        return counter;
    }


    //Function called from TouchableOpacity to do a death saving throw
    function DeathSavingThrow() {
        if (stateVars.currentHP > 0) {
            Alert.alert("Death saving throw is not needed", "When your HP is at or below 0, roll a D20 saving throw to avoid dying");
            return;
        }

        var savingThrow = DiceRoller.roll(20);

        //If the roll is a nat 20 the character survives and is set to 1HP
        if (savingThrow == 20) {
            setStateVars((prevState) => {
                Alert.alert("SUCCESS!", "You rolled a natural 20 on your death saving throw and have been revived at 1 HP");
                return ({
                    ...prevState,
                    deathCount: 0,
                    currentHP: 1,
                    requireUpdate: true
                })
            });

        }
        //If the roll is below 20 the character is still dying
        else {
            //If this was the last turn on the death counter, the character is dead
            if (stateVars.deathCount < 2) {
                Alert.alert("You have died!", "Your death saving throw was " + savingThrow + ".");
                setStateVars((prevState) => {
                    return ({
                        ...prevState,
                        deathCount: 1,
                        requireUpdate: true
                    })
                });
            }
            else {
                Alert.alert("You are still dying!", "Your death saving throw was " + savingThrow + ". You have " + (stateVars.deathCount - 1) + " turn(s) to roll a natural 20 to stay alive");
                setStateVars((prevState) => {
                    return ({
                        ...prevState,
                        deathCount: stateVars.deathCount - 1,
                        requireUpdate: true
                    })
                });
            }
        }
    }


    //Function called from TouchableOpacity to display an alert with info about the Death Counter
    function DeathCounterInfoPopup() {
        Alert.alert("Death Counter", "When your Hit Points drop to 0 or below, you are unconscious and bleeding out. A D4 is rolled to determine the Death Counter for how many turns you have before your character dies. During this time you can survive through the following means:"
            + "\n- If you roll a natural 20 on a D20 Death Saving Throw on your turn then the Death Counter is stopped and you are revived with 1 Hit Point."
            + "\n- If an ally reaches you and makes an INT or WIS roll on the current Target then the Death Counter is stopped. You are stable but still unconscious until healed above 0 Hit Points."
        );
    }


    //Function called from touchableOpacity on dice icons to roll
    function Roll(rollName, numDieSize, amountToAdd) {
        var result = DiceRoller.roll(numDieSize);

        Alert.alert(rollName + " roll = " + (result + amountToAdd), "D" + numDieSize + " result was " + result + " + " + amountToAdd);
    }



    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setStateVars((prevState) => {
                return ({
                    ...prevState,
                    viewHealth: !stateVars.viewHealth
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Health & Armor</Text>
                {(stateVars.viewHealth) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewHealth) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewHealth) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar2.png')} />}

            {(stateVars.viewHealth) && <ContentBox style={styles.dropdownContent}>
                {/*HP*/}
                <View style={styles.valueRow}>
                    <Text style={styles.valueHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>HIT POINTS</Text>

                    <View style={styles.valueInputWrapper}>
                        <TextInput
                            style={styles.valueInput}
                            defaultValue={(stateVars.editNumberID == 1) ? (stateVars.tempNumberInput): ("" + stateVars.currentHP)}
                            keyboardType={'number-pad'}
                            placeholder={"0"}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                            key={"" + (randTextKey + 1)}
                            onChangeText={(newText_) => setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    tempNumberInput: newText_,
                                    editNumberID: 1
                                })
                            })}
                            onBlur={() => {
                                var newHP = parseInt(stateVars.tempNumberInput);

                                if (!isNaN(newHP)) {
                                    if (newHP < 1) {
                                        GetDeathCounter();
                                    }

                                    setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            currentHP: newHP,
                                            editNumberID: 0,
                                            requireUpdate: true
                                        });
                                    });
                                }
                                else {
                                    Alert.alert("Please enter a valid number for the Hit Points");

                                    setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            editNumberID: 0
                                        });
                                    });
                                }
                            }}
                        />
                        <Text style={styles.valueText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Current HP</Text>
                    </View>
                    <View style={styles.deathCountInputWrapper}>
                        <TextInput
                            style={styles.deathCountInput}
                            defaultValue={(stateVars.editNumberID == 2) ? (stateVars.tempNumberInput) : ("" + stateVars.maxHP)}
                            keyboardType={'number-pad'}
                            placeholder={"0"}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                            key={"" + (randTextKey + 2)}
                            onChangeText={(newText_) => setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    tempNumberInput: newText_,
                                    editNumberID: 2
                                })
                            })}
                            onBlur={() => {
                                var newHP = parseInt(stateVars.tempNumberInput);

                                if (!isNaN(newHP)) {
                                    if (newHP < 1) {
                                        Alert.alert("Please enter a valid number for the Max Hit Points", "Max Hit Points must be greater than 0");
                                        newHP = 1;
                                    }

                                    setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            maxHP: newHP,
                                            editNumberID: 0,
                                            requireUpdate: true
                                        });
                                    });
                                }
                                else {
                                    Alert.alert("Please enter a valid number for the Max Hit Points");

                                    setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            editNumberID: 0
                                        });
                                    });
                                }
                            }}
                        />
                        <Text style={styles.valueText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Max HP</Text>
                    </View>
                </View>

                <View style={{height: 15}}/>

                {/*Death Counter*/}
                <View style={styles.valueRow}>
                    <Text style={styles.valueHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>DEATH COUNTER</Text>

                    <View style={styles.deathCountInputWrapper}>
                        <TextInput
                            style={styles.deathCountInput}
                            defaultValue={(stateVars.editNumberID == 3) ? (stateVars.tempNumberInput) : ("" + stateVars.deathCount)}
                            keyboardType={'number-pad'}
                            placeholder={"0"}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                            key={"" + (randTextKey + 3)}
                            onChangeText={(newText_) => setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    tempNumberInput: newText_,
                                    editNumberID: 3
                                })
                            })}
                            onBlur={() => {
                                var newDC = parseInt(stateVars.tempNumberInput);

                                if (!isNaN(newDC)) {
                                    if (newDC < 0) {
                                        newDC = 0;
                                    }

                                    setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            deathCount: newDC,
                                            editNumberID: 0,
                                            requireUpdate: true
                                        });
                                    });
                                }
                                else {
                                    setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            editNumberID: 0
                                        });
                                    });
                                }
                            }}
                        />
                        <Text style={styles.valueText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>'Til Dead</Text>
                    </View>

                    <TouchableOpacity onPress={() => DeathSavingThrow()}>
                        <D20Icon height={35} width={35}/>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.questionIcon} onPress={() => DeathCounterInfoPopup()}>
                        <QuestionIcon height={15} width={15} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 25 }} />

                {/*Armor*/}
                <View style={styles.valueRow}>
                    <Text style={styles.valueHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>ARMOR</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.conTotal + stateVars.lootBonus}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        {/*CON*/}
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                editable={false}
                                value={"" + stateVars.conTotal}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 13)}
                            />
                            <Text style={styles.abilityText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>CON</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        {/*Bonus*/}
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 4) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonus)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 4)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 4
                                    })
                                })}
                                onBlur={() => {
                                    var newBonus = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newBonus)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonus: newBonus,
                                                editNumberID: 0,
                                                requireUpdate: true
                                            });
                                        });
                                    }
                                    else {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                editNumberID: 0
                                            });
                                        });
                                    }
                                }}
                            />
                            <Text style={styles.abilityText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Bonuses</Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Armor", 20, stateVars.conTotal)}>
                        <D20Icon height={35} width={35} transform={[{ rotate: 45 }]}/>
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
        paddingLeft: 0,
        paddingRight: 0,
    },

    valueRow: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingBottom: 5,
        justifyContent: 'space-evenly',
        width: '100%',
    },

    valueHeader: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 18,
        textAlignVertical: 'center',
        textAlign: 'center',
    },

    valueInputWrapper: {
        width: 65,
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
    },

    valueInput: {
        fontFamily: Fonts.icrpgFont1,
        color: Colors.icrpgText,
        backgroundColor: Colors.icrpgInputBG,
        fontSize: 20,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        alignSelf: 'center',
        height: 45,
        width: 70,
        marginRight: 10,
        marginLeft: 5,
    },

    valueText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 10,
        textAlign: 'center',
    },

    deathCountInputWrapper: {
        width: 65,
        marginLeft: 5,
        marginRight: 5,
        alignSelf: 'center',
    },

    deathCountInput: {
        fontFamily: Fonts.icrpgFont1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: Colors.icrpgInputBG,
        borderBottomColor: Colors.icrpgText,
        borderBottomWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    questionIcon: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingRight: 3,
        alignSelf: 'center',
    },

    effortDie: {
        alignSelf: 'center'
    },

    statGroup: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    dividerText: {
        fontFamily: Fonts.icrpgFont2,
        fontSize: 14,
        color: Colors.icrpgText
    },

    abilityValue: {
        fontFamily: Fonts.icrpgFont1,
        color: Colors.icrpgText,
        fontSize: 20,
        fontWeight: 'bold',
        textAlignVertical: 'center',
        borderWidth: 1,
        borderRadius: 10,
        textAlign: 'center',
        alignSelf: 'center',
        height: 45,
        width: 45,
        marginRight: 3,
        marginLeft: 3,
    },

    abilityInputWrapper: {
        width: 45,
        marginLeft: 3,
        marginRight: 3,
    },

    abilityText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 10,
    },

    abilityInput: {
        fontFamily: Fonts.icrpgFont1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: Colors.icrpgInputBG,
        borderBottomColor: Colors.icrpgText,
        borderBottomWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    collapsedImage: {
        marginTop: 10,
        alignSelf: 'center',
    }
});

export default CharHealthAndArmor;
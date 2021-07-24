import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

import ContentBox from './ContentBox.js';
import DiceRoller from '../../functions/dice/DiceRoller';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';
import D20Icon from '../../assets/icons/D20_icon_icrpg.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const CharStats = forwardRef(({ abilityScores, navigation, lootBonuses, onUpdate }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return {
                    abilityScores: stateVars.abilityScores,
                    lootBonuses: stateVars.lootBonuses
                };
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        abilityScores: abilityScores,
        lootBonuses: lootBonuses,
        viewAbilities: true,
        requireUpdate: false,
        tempNumberInput: "",
        /*ID for which input field is currently being edited
         * 0: Nothing being edited
         * 1: Str base
         * 2: Str bonus
         * 3: Dex base
         * 4: Dex bonus
         * 5: Con base
         * 6: Con bonus
         * 7: Int base
         * 8: Int bonus
         * 9: Wis base
         * 10: Wis bonus
         * 11: Cha base
         * 12: Cha bonus
         */
        editNumberID: 0 
    });
    //Const var to use as a component key for TextInputs to mitigate an error where they're sometimes created with duplicate keys
    const randTextKey = 1200;


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
                navigation.navigate("Error", { userMessage: "An error occurred when trying to update the ICRPG character stats.", errorMessage: error });
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
                    viewAbilities: !stateVars.viewAbilities
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Ability Scores</Text>
                {(stateVars.viewAbilities) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewAbilities) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewAbilities) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar3.png')} />}

            {(stateVars.viewAbilities) && <ContentBox style={styles.dropdownContent}>
                {/*STR*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.abilityHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>STR</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.abilityScores.str + stateVars.lootBonuses.str}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 1) ? (stateVars.tempNumberInput) : ("" + stateVars.abilityScores.str)}
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
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                abilityScores: {
                                                    ...prevState.abilityScores,
                                                    str: newVal
                                                },
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
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Base</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 2) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.str)}
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
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonuses: {
                                                    ...prevState.lootBonuses,
                                                    str: newVal
                                                },
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Strength", 20, stateVars.abilityScores.str + stateVars.lootBonuses.str)}>
                        <D20Icon height={35} width={35} transform={[{rotate: 15}]}/>
                    </TouchableOpacity>
                </View>
                {/*DEX*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.abilityHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>DEX</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.abilityScores.dex + stateVars.lootBonuses.dex}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 3) ? (stateVars.tempNumberInput) : ("" + stateVars.abilityScores.dex)}
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
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                abilityScores: {
                                                    ...prevState.abilityScores,
                                                    dex: newVal
                                                },
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
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Base</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 4) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.dex)}
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
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonuses: {
                                                    ...prevState.lootBonuses,
                                                    dex: newVal
                                                },
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
                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Dexterity", 20, stateVars.abilityScores.dex + stateVars.lootBonuses.dex)}>
                        <D20Icon height={35} width={35} transform={[{ rotate: 115 }]}/>
                    </TouchableOpacity>
                </View>
                {/*CON*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.abilityHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>CON</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.abilityScores.con + stateVars.lootBonuses.con}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 5) ? (stateVars.tempNumberInput) : ("" + stateVars.abilityScores.con)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 5)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 5
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                abilityScores: {
                                                    ...prevState.abilityScores,
                                                    con: newVal
                                                },
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
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Base</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 6) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.con)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 6)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 6
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonuses: {
                                                    ...prevState.lootBonuses,
                                                    con: newVal
                                                },
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Constitution", 20, stateVars.abilityScores.con + stateVars.lootBonuses.con)}>
                        <D20Icon height={35} width={35} />
                    </TouchableOpacity>
                </View>
                {/*INT*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.abilityHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>INT</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.abilityScores.int + stateVars.lootBonuses.int}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 7) ? (stateVars.tempNumberInput) : ("" + stateVars.abilityScores.int)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 7)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 7
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                abilityScores: {
                                                    ...prevState.abilityScores,
                                                    int: newVal
                                                },
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
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Base</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 8) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.int)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 8)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 8
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonuses: {
                                                    ...prevState.lootBonuses,
                                                    int: newVal
                                                },
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Intelligence", 20, stateVars.abilityScores.int + stateVars.lootBonuses.int)}>
                        <D20Icon height={35} width={35} transform={[{ rotate: 150 }]}/>
                    </TouchableOpacity>
                </View>
                {/*WIS*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.abilityHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>WIS</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.abilityScores.wis + stateVars.lootBonuses.wis}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 9) ? (stateVars.tempNumberInput) : ("" + stateVars.abilityScores.wis)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 9)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 9
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                abilityScores: {
                                                    ...prevState.abilityScores,
                                                    wis: newVal
                                                },
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
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Base</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 10) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.wis)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 10)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 10
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonuses: {
                                                    ...prevState.lootBonuses,
                                                    wis: newVal
                                                },
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Wisdom", 20, stateVars.abilityScores.wis + stateVars.lootBonuses.wis)}>
                        <D20Icon height={35} width={35} transform={[{ rotate: 26 }]}/>
                    </TouchableOpacity>
                </View>
                {/*CHA*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.abilityHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>CHA</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.abilityScores.cha + stateVars.lootBonuses.cha}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 11) ? (stateVars.tempNumberInput) : ("" + stateVars.abilityScores.cha)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 11)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 11
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                abilityScores: {
                                                    ...prevState.abilityScores,
                                                    cha: newVal
                                                },
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
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Base</Text>
                        </View>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 12) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.cha)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 12)}
                                onChangeText={(newText_) => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        tempNumberInput: newText_,
                                        editNumberID: 12
                                    })
                                })}
                                onBlur={() => {
                                    var newVal = parseInt(stateVars.tempNumberInput);

                                    if (!isNaN(newVal)) {
                                        setStateVars((prevState) => {
                                            return ({
                                                ...prevState,
                                                lootBonuses: {
                                                    ...prevState.lootBonuses,
                                                    cha: newVal
                                                },
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Charisma", 20, stateVars.abilityScores.cha + stateVars.lootBonuses.cha)}>
                        <D20Icon height={35} width={35} transform={[{ rotate: 280 }]}/>
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

    abilityRow: {
        flexDirection: 'row',
        alignSelf: 'center',
        paddingBottom: 12,
        justifyContent: 'space-evenly',
        width: '100%',
    },

    abilityHeader: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        width: '20%',
    },

    effortHeader: {
        fontFamily: Fonts.icrpgFont1,
        color: Colors.icrpgText,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
        textAlignVertical: 'center',
        width: '20%',
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

    collapsedImage: {
        marginTop: 10,
        alignSelf: 'center',
    }
});

export default CharStats;
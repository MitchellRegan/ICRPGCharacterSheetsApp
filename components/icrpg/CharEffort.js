import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';

import ContentBox from './ContentBox.js';
import DiceRoller from '../../functions/dice/DiceRoller';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';
import D4Icon from '../../assets/icons/D4_icon_icrpg.svg';
import D6Icon from '../../assets/icons/D6_icon_icrpg.svg';
import D8Icon from '../../assets/icons/D8_icon_icrpg.svg';
import D10Icon from '../../assets/icons/D10_icon_icrpg.svg';
import D12Icon from '../../assets/icons/D12_icon_icrpg.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const CharEffort = forwardRef(({ effort, lootBonuses, navigation, onUpdate }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return {
                    lootBonuses: stateVars.lootBonuses,
                    effort: stateVars.effort
                };
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        effort: effort,
        lootBonuses: lootBonuses,
        viewEffort: true,
        requireUpdate: false,
        tempNumberInput: "",
        /*ID for which input field is currently being edited
         * 0: Nothing being edited
         * 1: Basic base
         * 2: Basic bonus
         * 3: Weapon base
         * 4: Weapon bonus
         * 5: Gun base
         * 6: Gun bonus
         * 7: Magic base
         * 8: Magic bonus
         * 9: Ult base
         * 10: Ult bonus
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
                    viewEffort: !stateVars.viewEffort
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Effort</Text>
                {(stateVars.viewEffort) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewEffort) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewEffort) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar2.png')} />}

            {(stateVars.viewEffort) && <ContentBox style={styles.dropdownContent}>
                {/*Basic Effort*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.effortHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>BASIC</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.effort.basic + stateVars.lootBonuses.basicEffort}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 1) ? (stateVars.tempNumberInput) : ("" + stateVars.effort.basic)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 15)}
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
                                                effort: {
                                                    ...prevState.effort,
                                                    basic: newVal
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
                                defaultValue={(stateVars.editNumberID == 2) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.basicEffort)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 16)}
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
                                                    basicEffort: newVal
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Basic Effort", 4, stateVars.effort.basic + stateVars.lootBonuses.basicEffort)}>
                        <D4Icon height={35} width={35} />
                    </TouchableOpacity>
                </View>
                {/*Weapons & Tool*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.effortHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>WEAPONS & TOOLS</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.effort.weaponDamage + stateVars.lootBonuses.weaponDamage}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 3) ? (stateVars.tempNumberInput) : ("" + stateVars.effort.weaponDamage)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 17)}
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
                                                effort: {
                                                    ...prevState.effort,
                                                    weaponDamage: newVal
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
                                defaultValue={(stateVars.editNumberID == 4) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.weaponDamage)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 18)}
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
                                                    weaponDamage: newVal
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Weapons & Tools", 6, stateVars.effort.weaponDamage + stateVars.lootBonuses.weaponDamage)}>
                        <D6Icon height={35} width={35} />
                    </TouchableOpacity>
                </View>
                {/*Guns*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.effortHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>GUNS</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.effort.gunDamage + stateVars.lootBonuses.gunDamage}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 5) ? (stateVars.tempNumberInput) : ("" + stateVars.effort.gunDamage)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 19)}
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
                                                effort: {
                                                    ...prevState.effort,
                                                    gunDamage: newVal
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
                                defaultValue={(stateVars.editNumberID == 6) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.gunDamage)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 20)}
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
                                                    gunDamage: newVal
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Guns", 8, stateVars.effort.gunDamage + stateVars.lootBonuses.gunDamage)}>
                        <D8Icon height={35} width={35} />
                    </TouchableOpacity>
                </View>
                {/*Magic Effect*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.effortHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>MAGIC EFFECT</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.effort.magicEffect + stateVars.lootBonuses.magicEffect}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 7) ? (stateVars.tempNumberInput) : ("" + stateVars.effort.magicEffect)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 21)}
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
                                                effort: {
                                                    ...prevState.effort,
                                                    magicEffect: newVal
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
                                defaultValue={(stateVars.editNumberID == 8) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.magicEffect)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 22)}
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
                                                    magicEffect: newVal
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Magic Effect", 10, stateVars.effort.magicEffect + stateVars.lootBonuses.magicEffect)}>
                        <D10Icon height={35} width={35} />
                    </TouchableOpacity>
                </View>
                {/*Ultimate*/}
                <View style={styles.abilityRow}>
                    <Text style={styles.effortHeader}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>ULTIMATE</Text>

                    <View style={styles.statGroup}>
                        <Text style={styles.abilityValue}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.effort.ultimate + stateVars.lootBonuses.ultimate}</Text>
                        <Text style={styles.dividerText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>=</Text>
                        <View style={styles.abilityInputWrapper}>
                            <TextInput
                                style={styles.abilityInput}
                                defaultValue={(stateVars.editNumberID == 9) ? (stateVars.tempNumberInput) : ("" + stateVars.effort.ultimate)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 23)}
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
                                                effort: {
                                                    ...prevState.effort,
                                                    ultimate: newVal
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
                                defaultValue={(stateVars.editNumberID == 10) ? (stateVars.tempNumberInput) : ("" + stateVars.lootBonuses.ultimate)}
                                keyboardType={'number-pad'}
                                placeholder={"0"}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                key={"" + (randTextKey + 24)}
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
                                                    ultimate: newVal
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

                    <TouchableOpacity style={styles.effortDie} onPress={() => Roll("Ultimate", 12, stateVars.effort.ultimate + stateVars.lootBonuses.ultimate)}>
                        <D12Icon height={35} width={35} />
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

    effortHeader: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 13,
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

export default CharEffort;
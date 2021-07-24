import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TextInput, Image, TouchableOpacity, FlatList, Alert } from 'react-native';

import ContentBox from './ContentBox.js';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const EquippedGear = forwardRef(({ onUpdate, navigation, equipmentArray = [], coins = 0 }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return {
                    gear: stateVars.equippedGear,
                    coin: stateVars.coin
                };
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        equippedGear: equipmentArray,
        coin: coins,
        viewEquippedGear: true,
        promptNewEquippedGear: false,
        newEquippedGearText: "",
        requireUpdate: false,
        tempNumberInput: "",
        /*ID for which input field is currently being edited
         * 0: Nothing being edited
         * 1: Coins
         */
        editNumberID: 0 
    });
    //Const var to use as a component key for TextInputs to mitigate an error where they're sometimes created with duplicate keys
    const randTextKey = 1300;


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
                navigation.navigate("Error", { userMessage: "An error occurred when trying to update the ICRPG character equipment.", errorMessage: error });
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


    //Function called from the Equipped Gear section to add a new item to the list
    function AddEquippedGear(itemDescription_) {
        if (itemDescription_ == null || itemDescription_ == "") {
            return;
        }

        var equipArray = [];
        if (stateVars.equippedGear != null) {
            equipArray = stateVars.equippedGear;
        }

        equipArray.push({
            itemDescription: itemDescription_,
            equipped: false
        });

        setStateVars((prevState) => {
            return ({
                ...prevState,
                equippedGear: equipArray,
                promptNewEquippedGear: false,
                editGearIndex: -1,
                newEquippedGearText: "",
                requireUpdate: true
            });
        });
    }


    //Function called from TouchableOpacity to change the text of a piece of gear at the given index
    function UpdateGear(gearIndex, newGear) {
        var newGearArray = [];
        if (stateVars.equippedGear != null) {
            newGearArray = stateVars.equippedGear;
        }

        newGearArray[gearIndex] = {
            itemDescription: newGear,
            equipped: newGearArray[gearIndex].equipped
        };

        setStateVars((prevState) => {
            return ({
                ...prevState,
                equippedGear: newGearArray,
                promptNewEquippedGear: false,
                editGearIndex: -1,
                newEquippedGearText: "",
                requireUpdate: true
            });
        });
    }


    //Function called by TouchableOpacity to move a piece of gear up in the list
    function MoveGearUp(gearIndex) {
        if (gearIndex < 1) {
            return;
        }

        var newGearArray = [];
        if (stateVars.equippedGear != null) {
            newGearArray = stateVars.equippedGear;
        }

        var placeholder = newGearArray[gearIndex - 1];
        newGearArray[gearIndex - 1] = newGearArray[gearIndex];
        newGearArray[gearIndex] = placeholder;

        setStateVars((prevState) => {
            return ({
                ...prevState,
                equippedGear: newGearArray,
                promptNewEquippedGear: false,
                editGearIndex: gearIndex - 1,
                requireUpdate: true
            });
        });
    }


    //Function called by TouchableOpacity to move a piece of gear down in the list
    function MoveGearDown(gearIndex) {
        if (gearIndex > stateVars.equippedGear.length - 2) {
            return;
        }

        var newGearArray = [];
        if (stateVars.equippedGear != null) {
            newGearArray = stateVars.equippedGear;
        }

        var placeholder = newGearArray[gearIndex + 1];
        newGearArray[gearIndex + 1] = newGearArray[gearIndex];
        newGearArray[gearIndex] = placeholder;

        setStateVars((prevState) => {
            return ({
                ...prevState,
                equippedGear: newGearArray,
                promptNewEquippedGear: false,
                editGearIndex: gearIndex + 1,
                requireUpdate: true
            });
        });
    }


    //Function called by TouchableOpacity to delete this piece of gear from the array
    function DeleteGearPrompt(gearIndex) {
        Alert.alert("Are you sure you want to delete this item?", stateVars.equippedGear[gearIndex].itemDescription,
            [
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => DeleteGear(gearIndex)
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    }


    //Function called by DeleteGearPrompt to actually delete a piece of gear at the given index
    function DeleteGear(gearIndex) {
        var newGearArray = [];
        if (stateVars.equippedGear != null) {
            newGearArray = stateVars.equippedGear;
        }

        newGearArray.splice(gearIndex, 1);

        setStateVars((prevState) => {
            return ({
                ...prevState,
                equippedGear: newGearArray,
                promptNewEquippedGear: false,
                editGearIndex: -1,
                newEquippedGearText: "",
                requireUpdate: true
            });
        });
    }


    //Function called from TouchableOpacity to equip or unequip a piece of gear
    function ToggleGearEquip(gearIndex) {
        var newGearArray = [];
        if (stateVars.equippedGear != null) {
            newGearArray = stateVars.equippedGear;
        }

        newGearArray[gearIndex] = {
            itemDescription: newGearArray[gearIndex].itemDescription,
            equipped: !newGearArray[gearIndex].equipped
        };

        setStateVars((prevState) => {
            return ({
                ...prevState,
                equippedGear: newGearArray,
                requireUpdate: true
            });
        });
    }



    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setStateVars((prevState) => {
                return ({
                    ...prevState,
                    viewEquippedGear: !stateVars.viewEquippedGear
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Loot</Text>
                {(stateVars.viewEquippedGear) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewEquippedGear) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewEquippedGear) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar1.png')} />}

            {(stateVars.viewEquippedGear) && <ContentBox style={styles.dropdownContent}>
                <FlatList
                    style={styles.flatList}
                    data={stateVars.equippedGear}
                    keyExtractor={(itemData, index) => index.toString()}
                    renderItem={itemData => {
                        return (<View>
                            {/*Item not selected*/}
                            {(stateVars.editGearIndex != itemData.index) && <View style={styles.equipmentLine}>
                                <TouchableOpacity style={styles.equipmentTextWrapper} onPress={() => setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        editGearIndex: itemData.index,
                                        promptNewEquippedGear: false,
                                        newEquippedGearText: stateVars.equippedGear[itemData.index].itemDescription
                                    });
                                })}>
                                    <Text style={styles.equipmentText}
                                        allowFontScaling={Fonts.allowScaling}
                                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{itemData.item.itemDescription}</Text>
                                </TouchableOpacity>

                                {(itemData.item.equipped) && <TouchableOpacity style={styles.equipButton} onPress={() => ToggleGearEquip(itemData.index)}>
                                    <Text style={styles.equipText}
                                        allowFontScaling={Fonts.allowScaling}
                                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Equipped</Text>
                                </TouchableOpacity>}

                                {(!itemData.item.equipped) && <TouchableOpacity style={styles.carryButton} onPress={() => ToggleGearEquip(itemData.index)}>
                                    <Text style={styles.carryText}
                                        allowFontScaling={Fonts.allowScaling}
                                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Carried</Text>
                                </TouchableOpacity>}
                            </View>}

                            {/*Item is selected*/}
                            {(itemData.index == stateVars.editGearIndex) && <View style={styles.editGearWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    value={stateVars.newEquippedGearText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                    key={"" + (randTextKey + 1)}
                                    onChangeText={(newText) => setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            newEquippedGearText: newText
                                        })
                                    })}
                                />
                                <View style={styles.equipmentButtonRow}>
                                    <TouchableOpacity onPress={() => UpdateGear(itemData.index, stateVars.newEquippedGearText)}>
                                        <Text style={styles.equipmentButtonPrompt}
                                            allowFontScaling={Fonts.allowScaling}
                                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            promptNewEquippedGear: false,
                                            newEquippedGearText: "",
                                            editGearIndex: -1
                                        });
                                    })}>
                                        <Text style={styles.equipmentButtonPrompt}
                                            allowFontScaling={Fonts.allowScaling}
                                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => DeleteGearPrompt(itemData.index)}>
                                        <Text style={styles.equipmentButtonPrompt}
                                            allowFontScaling={Fonts.allowScaling}
                                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Delete</Text>
                                    </TouchableOpacity>
                                    {(itemData.index > 0) && <TouchableOpacity style={styles.arrowButtons} onPress={() => MoveGearUp(itemData.index)}>
                                        <ArrowUp height={20} width={20} />
                                    </TouchableOpacity>}
                                    {(itemData.index < stateVars.equippedGear.length - 1) && <TouchableOpacity style={styles.arrowButtons} onPress={() => MoveGearDown(itemData.index)}>
                                        <ArrowDown height={20} width={20} />
                                    </TouchableOpacity>}
                                </View>
                            </View>}
                        </View>);
                    }}
                />

                {(!stateVars.promptNewEquippedGear) && <View style={styles.equipmentButtonRow}>
                    <TouchableOpacity onPress={() => setStateVars((prevState) => {
                        return ({
                            ...prevState,
                            promptNewEquippedGear: true,
                            editGearIndex: -1,
                            newEquippedGearText: ""
                        });
                    })}>
                        <Text style={styles.equipmentButtonPrompt}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Add New Item</Text>
                    </TouchableOpacity>
                </View>}

                {(stateVars.promptNewEquippedGear) && <View>
                    <View style={styles.pageBreak} />
                    <TextInput
                        style={styles.textInput}
                        value={stateVars.newEquippedGearText}
                        placeholder={"New Gear"}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 2)}
                        onChangeText={(newText) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                newEquippedGearText: newText
                            })
                        })}
                    />
                    <View style={styles.equipmentButtonRow}>
                        <TouchableOpacity onPress={() => AddEquippedGear(stateVars.newEquippedGearText)}>
                            <Text style={styles.equipmentButtonPrompt}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                promptNewEquippedGear: false,
                                newEquippedGearText: ""
                            });
                        })}>
                            <Text style={styles.equipmentButtonPrompt}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>}

                <View style={styles.coinRow}>
                    <Text style={styles.coinText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Coins:</Text>
                    <TextInput
                        style={styles.coinInput}
                        defaultValue={(stateVars.editNumberID == 1) ? (stateVars.tempNumberInput) : ("" + stateVars.coin)}
                        keyboardType={'number-pad'}
                        placeholder={"0"}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 3)}
                        onChangeText={(newText_) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                tempNumberInput: newText_,
                                editNumberID: 1
                            })
                        })}
                        onBlur={() => {
                            var newCoin = parseInt(stateVars.tempNumberInput);

                            if (!isNaN(newCoin)) {
                                setStateVars((prevState) => {
                                    return ({
                                        ...prevState,
                                        coin: newCoin,
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
                </View>

                {(stateVars.equippedGear.length > 0) && <Text style={styles.editText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>
                    Tap on an item to edit or move it.
            </Text>}
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

    flatList: {
        marginTop: 5,
        marginBottom: 5,
    },

    editGearWrapper: {
        borderWidth: 1,
        borderColor: Colors.icrpgText,
        borderRadius: 5,
        padding: 10,
    },

    equipmentLine: {
        flexDirection: 'row',
        width: '100%',
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 6,
        borderRadius: 3,
    },

    equipmentTextWrapper: {
        width: '80%',
        backgroundColor: Colors.icrpgInputBG
    },

    equipmentText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgHeaderText,
        fontSize: 16,
        paddingLeft: 5,
        paddingRight: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    equipmentButtonRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    equipmentButtonPrompt: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: Colors.icrpgText,
        borderRadius: 10,
    },

    textInput: {
        fontFamily: Fonts.icrpgFont2,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: Colors.icrpgInputBG,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 5,
        borderRadius: 3,
    },

    coinRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginTop: 10,
        paddingRight: 10,
    },

    coinText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgHeaderText,
        fontSize: 18,
    },

    pageBreak: {
        backgroundColor: Colors.icrpgText,
        width: '95%',
        alignSelf: 'center',
        height: 2,
        borderRadius: 20,
        marginTop: 10,
    },

    coinInput: {
        fontSize: 18,
        textAlign: 'center',
        marginLeft: 10,
        paddingLeft: 5,
        paddingRight: 5,
        backgroundColor: Colors.icrpgInputBG,
        borderBottomColor: Colors.icrpgText,
        borderBottomWidth: 1,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
    },

    arrowButtons: {
        borderColor: Colors.icrpgText,
        borderWidth: 1,
        borderRadius: 5,
        alignContent: 'center',
        padding: 3,
    },

    equipButton: {
        backgroundColor: Colors.icrpgHighlight,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.icrpgText,
        width: '20%',
        height: 30,
        alignSelf: 'center',
    },

    equipText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.shelf,
        fontSize: 12,
        padding: 3,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '100%',
    },

    carryButton: {
        backgroundColor: Colors.shelf,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: Colors.icrpgText,
        width: '20%',
        height: 30,
        alignSelf: 'center',
    },

    carryText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 10,
        padding: 3,
        textAlign: 'center',
        textAlignVertical: 'center',
        height: '100%',
    },

    editText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 9,
        textAlign: 'center',
    },

    collapsedImage: {
        marginTop: 10,
        alignSelf: 'center',
    }
});

export default EquippedGear;
import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image, FlatList, Alert } from 'react-native';

import ContentBox from './ContentBox.js';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const ItemList = forwardRef(({ onUpdate, navigation, title = "", itemName = "", itemArray = [] }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return stateVars.itemArray;
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        itemArray: itemArray,
        viewNotes: true,
        promptNewNote: false,
        newNoteText: "",
        editNoteIndex: -1,
        requireUpdate: false
    });
    //Const var to use as a component key for TextInputs to mitigate an error where they're sometimes created with duplicate keys
    const randTextKey = 1400;


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
                navigation.navigate("Error", { userMessage: "An error occurred when trying to update the ICRPG item list.", errorMessage: error });
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


    //Function called from TextInput to add a new note to the array
    function AddNote(noteText_ = "") {
        if (noteText_ == null || noteText_ == "") {
            return;
        }

        var newNoteArray = [];
        if (stateVars.itemArray != null) {
            newNoteArray = stateVars.itemArray;
        }

        newNoteArray.push(noteText_);

        setStateVars((prevState) => {
            return ({
                ...prevState,
                noteArray: newNoteArray,
                promptNewNote: false,
                newNoteText: "",
                requireUpdate: true
            });
        });
    }


    //Function called from TouchableOpacity to change the text of a note at the given index
    function UpdateNote(noteIndex, newNote) {
        var newNoteArray = [];
        if (stateVars.itemArray != null) {
            newNoteArray = stateVars.itemArray;
        }

        newNoteArray[noteIndex] = newNote;

        setStateVars((prevState) => {
            return ({
                ...prevState,
                noteArray: newNoteArray,
                promptNewNote: false,
                editNoteIndex: -1,
                newNoteText: "",
                requireUpdate: true
            });
        });
    }


    //Function called by TouchableOpacity to move a note up in the list
    function MoveNoteUp(noteIndex) {
        if (noteIndex < 1) {
            return;
        }

        var newNoteArray = [];
        if (stateVars.itemArray != null) {
            newNoteArray = stateVars.itemArray;
        }

        var placeholder = newNoteArray[noteIndex - 1];
        newNoteArray[noteIndex - 1] = newNoteArray[noteIndex];
        newNoteArray[noteIndex] = placeholder;

        setStateVars((prevState) => {
            return ({
                ...prevState,
                noteArray: newNoteArray,
                promptNewNote: false,
                editNoteIndex: noteIndex - 1,
                requireUpdate: true
            });
        });
    }


    //Function called by TouchableOpacity to move a note down in the list
    function MoveNoteDown(noteIndex) {
        if (noteIndex > stateVars.itemArray.length - 2) {
            return;
        }

        var newNoteArray = [];
        if (stateVars.itemArray != null) {
            newNoteArray = stateVars.itemArray;
        }

        var placeholder = newNoteArray[noteIndex + 1];
        newNoteArray[noteIndex + 1] = newNoteArray[noteIndex];
        newNoteArray[noteIndex] = placeholder;

        setStateVars((prevState) => {
            return ({
                ...prevState,
                noteArray: newNoteArray,
                promptNewNote: false,
                editNoteIndex: noteIndex + 1,
                requireUpdate: true
            });
        });
    }


    //Function called by TouchableOpacity to delete this note from the array
    function DeleteNotePrompt(noteIndex) {
        Alert.alert("Are you sure you want to delete this note?", "",
            [
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => DeleteNote(noteIndex)
                },
                {
                    text: "Cancel",
                    style: "cancel"
                }
            ]
        );
    }


    //Function called by DeleteNotePrompt to actually delete a note at the given index
    function DeleteNote(noteIndex) {
        var newNoteArray = [];
        if (stateVars.itemArray != null) {
            newNoteArray = stateVars.itemArray;
        }

        newNoteArray.splice(noteIndex, 1);

        setStateVars((prevState) => {
            return ({
                ...prevState,
                noteArray: newNoteArray,
                promptNewNote: false,
                editNoteIndex: -1,
                newNoteText: "",
                requireUpdate: true
            });
        });
    }



    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setStateVars((prevState) => {
                return ({
                    ...prevState,
                    viewNotes: !stateVars.viewNotes
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{title}</Text>
                {(stateVars.viewNotes) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewNotes) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewNotes) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar1.png')} />}

            {(stateVars.viewNotes) && <ContentBox style={styles.dropdownContent}>
                <FlatList
                    style={styles.flatList}
                    data={stateVars.itemArray}
                    keyExtractor={(itemData, index) => index.toString()}
                    renderItem={itemData => {
                        return (<View>
                            {(itemData.index != stateVars.editNoteIndex) && <TouchableOpacity style={styles.noteLine} onPress={() => setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    editNoteIndex: itemData.index,
                                    promptNewNote: false,
                                    newNoteText: stateVars.itemArray[itemData.index]
                                });
                            })}>
                                <Text style={styles.noteText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{itemData.item}</Text>
                            </TouchableOpacity>}

                            {(itemData.index == stateVars.editNoteIndex) && <View style={styles.editNoteWrapper}>
                                <TextInput
                                    style={styles.textInput}
                                    value={stateVars.newNoteText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                                    key={"" + (randTextKey + 1)}
                                    onChangeText={(newText) => setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            newNoteText: newText
                                        })
                                    })}
                                />
                                <View style={styles.noteButtonRow}>
                                    <TouchableOpacity onPress={() => UpdateNote(itemData.index, stateVars.newNoteText)}>
                                        <Text style={styles.noteButtonPrompt}
                                            allowFontScaling={Fonts.allowScaling}
                                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Update</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => setStateVars((prevState) => {
                                        return ({
                                            ...prevState,
                                            promptNewNote: false,
                                            newNoteText: "",
                                            editNoteIndex: -1
                                        });
                                    })}>
                                        <Text style={styles.noteButtonPrompt}
                                            allowFontScaling={Fonts.allowScaling}
                                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Cancel</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => DeleteNotePrompt(itemData.index)}>
                                        <Text style={styles.noteButtonPrompt}
                                            allowFontScaling={Fonts.allowScaling}
                                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Delete</Text>
                                    </TouchableOpacity>
                                    {(itemData.index > 0) && <TouchableOpacity style={styles.arrowButtons} onPress={() => MoveNoteUp(itemData.index)}>
                                        <ArrowUp height={20} width={20} />
                                    </TouchableOpacity>}
                                    {(itemData.index < stateVars.itemArray.length - 1) && <TouchableOpacity style={styles.arrowButtons} onPress={() => MoveNoteDown(itemData.index)}>
                                        <ArrowDown height={20} width={20} />
                                    </TouchableOpacity>}
                                </View>
                            </View>}
                        </View>);
                    }}
                />

                {(!stateVars.promptNewNote) && <View style={styles.noteButtonRow}>
                    <TouchableOpacity onPress={() => setStateVars((prevState) => {
                        return ({
                            ...prevState,
                            promptNewNote: true,
                            editNoteIndex: -1,
                            newNoteText: ""
                        });
                    })}>
                        <Text style={styles.noteButtonPrompt}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Add New {itemName}</Text>
                    </TouchableOpacity>
                </View>}

                {(stateVars.promptNewNote) && <View>
                    <View style={styles.pageBreak}/>
                    <TextInput
                        style={styles.textInput}
                        value={stateVars.newNoteText}
                        placeholder={"New " + itemName}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
                        key={"" + (randTextKey + 2)}
                        onChangeText={(newText) => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                newNoteText: newText
                            })
                        })}
                    />
                    <View style={styles.noteButtonRow}>
                        <TouchableOpacity onPress={() => AddNote(stateVars.newNoteText)}>
                            <Text style={styles.noteButtonPrompt}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Add</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setStateVars((prevState) => {
                            return ({
                                ...prevState,
                                promptNewNote: false,
                                newNoteText: ""
                            });
                        })}>
                            <Text style={styles.noteButtonPrompt}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>}

                {(stateVars.itemArray.length > 0) && <Text style={styles.editText}
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

    dropdownContent: {
        padding: 10,
        paddingLeft: 15,
        paddingRight: 15,
    },

    flatList: {
        marginTop: 6,
        marginBottom: 6,
    },

    editNoteWrapper: {
        borderWidth: 1,
        borderColor: Colors.icrpgText,
        borderRadius: 5,
        padding: 10,
    },

    noteLine: {
        flexDirection: 'row',
        width: '100%',
        backgroundColor: Colors.icrpgInputBG,
        flexWrap: 'wrap',
        paddingLeft: 5,
        paddingRight: 5,
        marginBottom: 6,
        borderRadius: 3,
    },

    noteText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgHeaderText,
        fontSize: 16,
        width: '100%',
    },

    noteButtonRow: {
        marginTop: 10,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },

    noteButtonPrompt: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: Colors.icrpgText,
        borderRadius: 10,
    },

    pageBreak: {
        backgroundColor: Colors.icrpgText,
        width: '95%',
        alignSelf: 'center',
        height: 2,
        borderRadius: 20,
        marginTop: 10,
    },

    textInput: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: Colors.icrpgInputBG,
        paddingLeft: 5,
        paddingRight: 5,
        marginTop: 5,
        borderRadius: 3,
    },

    arrowButtons: {
        borderColor: Colors.icrpgText,
        borderWidth: 1,
        borderRadius: 5,
        alignContent: 'center',
        padding: 3,
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

export default ItemList;
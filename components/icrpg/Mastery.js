import React, { useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';

import ContentBox from './ContentBox.js';
import ArrowUp from '../../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../../assets/icons/ArrowDownRounded_icon.svg';
import QuestionIcon from '../../assets/icons/Question_icon.svg';
import MasteryEmptyIcon from '../../assets/icons/MasteryEmpty_icon.svg';
import MasteryFilledIcon from '../../assets/icons/MasteryFilled_icon.svg';

import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';

const Mastery = forwardRef(({ onUpdate, navigation, currentCount = 0, masteriesCompleted = 0 }, ref) => {
    //Handle to pass the RetrieveData function to the parent component
    useImperativeHandle(
        ref,
        () => ({
            //Function called externally to retrieve data from this component
            RetrieveData() {
                return {
                    currentCount: stateVars.currentCount,
                    masteriesCompleted: stateVars.masteriesCompleted
                };
            }
        }),
    );

    const [stateVars, setStateVars] = useState({
        currentCount: currentCount,
        masteriesCompleted: masteriesCompleted,
        viewMastery: true,
        requireUpdate: false
    });


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
                navigation.navigate("Error", { userMessage: "An error occurred when trying to update the ICRPG character mastery.", errorMessage: error });
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


    //Function called from TouchableOpacity to increase or decrease the mastery counter value
    function ChangeCounter(amountToAdd = 0) {
        var newValue = stateVars.currentCount + amountToAdd;
        var newMastery = stateVars.masteriesCompleted;

        if (newValue < 0) {
            if (stateVars.masteriesCompleted > 0) {
                newMastery--;
                newValue += 20;
            }
            else {
                newValue = 0;
            }
        }
        else if (newValue >= 20) {
            newValue = newValue - 20;
            newMastery += 1;
            Alert.alert("Mastery Completed!", "You've gained enough mastery points to learn a new Mastery Ability. If the Mastery Ability requires a specific piece of Starter Loot, you gain it instantly. Your Mastery Points have been reset to 0.");
        }

        setStateVars((prevState) => {
            return ({
                ...prevState,
                currentCount: newValue,
                masteriesCompleted: newMastery,
                requireUpdate: true
            });
        });
    }


    //Function called from return to display all of the filled and empty mastery bubbles
    function DisplayMasteryBubbles() {
        var display = [];

        for (var i = 0; i < 20; i++) {
            if (i < stateVars.currentCount) {
                display.push(<MasteryFilledIcon height={11} width={11} key={""+i}/>);
            }
            else {
                display.push(<MasteryEmptyIcon height={11} width={11} key={"" + i}/>);
            }
        }

        return display;
    }


    //Function called from TouchableOpacity to display a description of Mastery Points
    function MasteryInfoPopup() {
        Alert.alert("Mastery Points", "Whenever you roll a natural 20 on a D20 roll, add 1 Mastery Point to your character sheet. Once you reach 20 Mastery Points your Mastery Points are reset to 0 and you gain any Mastery Ability of your type. If that Mastery Ability requires a specific piece of Starter Loot you gain it instantly. This process can only happen 3 times per character.");
    }



    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.headerButton} onPress={() => setStateVars((prevState) => {
                return ({
                    ...prevState,
                    viewMastery: !stateVars.viewMastery
                });
            })}>
                <Image style={styles.headerBG} source={require('../../assets/decals/headerBar.png')} />
                <Text style={styles.header}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Mastery</Text>
                {(stateVars.viewMastery) && <ArrowDown height={25} width={25} />}
                {(!stateVars.viewMastery) && <ArrowUp height={25} width={25} />}
            </TouchableOpacity>

            {(!stateVars.viewMastery) && <Image style={styles.collapsedImage} source={require('../../assets/decals/blackBar3.png')} />}

            {(stateVars.viewMastery) && <ContentBox style={styles.dropdownContent}>
                <View style={styles.infoRow}>
                    <Text style={styles.masteryText}
                        allowFontScaling={Fonts.allowScaling}
                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Mastery Points: {stateVars.currentCount}</Text>
                    <TouchableOpacity style={styles.questionIcon} onPress={() => MasteryInfoPopup()}>
                        <QuestionIcon height={15} width={15}/>
                    </TouchableOpacity>
                </View>
                <View style={styles.sliderRow}>
                    <TouchableOpacity onPress={() => ChangeCounter(-1)}>
                        <Text style={styles.sliderButton}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>-</Text>
                    </TouchableOpacity>

                    <View style={styles.bubbleRow}>
                        {DisplayMasteryBubbles()}
                    </View>

                    <TouchableOpacity onPress={() => ChangeCounter(1)}>
                        <Text style={styles.sliderButton}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>+</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.masteryCompletedText}
                    allowFontScaling={Fonts.allowScaling}
                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Masteries Completed: {stateVars.masteriesCompleted}</Text>
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

    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    questionIcon: {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingRight: 3,
        alignItems: 'center',
    },

    masteryText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 16,
        textAlignVertical: 'center',
    },

    sliderRow: {
        flexDirection: 'row',
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10
    },

    sliderButton: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 26,
        paddingLeft: 10,
        paddingRight: 10,
        textAlign: 'center',
        textAlignVertical: 'center',
    },

    slider: {
        flex: 1,
    },

    masteryCompletedText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 14,
        textAlignVertical: 'center',
    },

    collapsedImage: {
        marginTop: 10,
        alignSelf: 'center',
    },

    bubbleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    }
});

export default Mastery;
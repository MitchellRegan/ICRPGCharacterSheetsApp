import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Picker, Image, ImageBackground } from 'react-native';

import DefaultNavBar from '../components/navBars/DefaultNavBar';
import DefaultButton from '../components/buttons/DefaultButton';
import ContentBox from '../components/icrpg/ContentBox.js';

import DiceRoller from '../functions/dice/DiceRoller';

import CoinIcon from '../assets/icons/Coin_icon_icrpg.svg';
import D4Icon from '../assets/icons/D4_icon_icrpg.svg';
import D6Icon from '../assets/icons/D6_icon_icrpg.svg';
import D8Icon from '../assets/icons/D8_icon_icrpg.svg';
import D10Icon from '../assets/icons/D10_icon_icrpg.svg';
import D12Icon from '../assets/icons/D12_icon_icrpg.svg';
import D20Icon from '../assets/icons/D20_icon_icrpg.svg';
import D100Icon from '../assets/icons/D100_icon_icrpg.svg';

import ArrowUp from '../assets/icons/ArrowUpRounded_icon.svg';
import ArrowDown from '../assets/icons/ArrowDownRounded_icon.svg';

import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';

const DieRollerScreen = props => {
    const [stateVars, setStateVars] = useState({
        diceToRoll: [],
        valueToAdd: 0,
        coinFlip: false,
        history: [],
        mostRecentRoll: null,
        showHistory: true,
        showDiceToRoll: true,
        rollType: 0,
        tempNumberInput: "",
        /*ID for which input field is currently being edited
         * 0: Nothing being edited
         * 1: Value To Add
         */
        editNumberID: 0 
    });


    //Function called from the dice buttons in the input view to add dice to the pool to roll
    function AddDieToRollList(sides_ = 6) {
        if (stateVars.diceToRoll.length >= 20) {
            return;
        }

        var newDiceArray = stateVars.diceToRoll;
        newDiceArray.push(sides_);

        setStateVars((prevState) => {
            return ({
                ...prevState,
                diceToRoll: newDiceArray
            });
        });
    }


    //Function called in the display view to remove dice from the pool to roll
    function RemoveDiceToRoll(index_ = 0) {
        var newDiceArray = stateVars.diceToRoll;
        newDiceArray.splice(index_, 1);

        setStateVars((prevState) => {
            return ({
                ...prevState,
                diceToRoll: newDiceArray
            });
        });
    }


    //Function called from the Roll button in the input view to get the sum results of the dice pool
    function RollDiceTotal() {
        //If there are no dice to roll, we don't roll....
        if (stateVars.diceToRoll.length == 0) {
            return;
        }

        //Calling the DiceRoller function library to get the sum of our pool of dice to roll
        var dicePool = DiceRoller.dicePoolSum(stateVars.diceToRoll, stateVars.valueToAdd);

        //Adding this roll description to the front of our History array
        var newHistory = new Array(stateVars.history.length + 1);
        newHistory[0] = dicePool.description;
        for (var i = 1; i < newHistory.length; i++) {
            newHistory[i] = stateVars.history[i - 1];
        }

        //Making sure the history array doesn't go past our limit
        if (newHistory.length > 20) {
            newHistory.splice(stateVars.history.length - 1, 1);
        }

        //If only coins were flipped, we want the total to display heads or tails
        if (dicePool.coinFlip) {
            var coinResult = "";

            if (dicePool.numHeads > (stateVars.diceToRoll.length / 2)) {
                coinResult = "Heads";
            }
            else if (dicePool.numHeads < (stateVars.diceToRoll.length / 2)) {
                coinResult = "Tails";
            }
            else if (dicePool.numHeads == (stateVars.diceToRoll.length / 2)) {
                coinResult = "Tie";
            }

            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    history: newHistory,
                    mostRecentRoll: coinResult,
                    coinFlip: dicePool.coinFlip
                });
            })
        }
        //Otherwise we want to display dice results
        else {
            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    history: newHistory,
                    mostRecentRoll: dicePool.total,
                    coinFlip: dicePool.coinFlip
                });
            })
        }
    }


    //Function called from the Roll High button in the input view to roll the dice and take the highest value
    function RollDiceHighest() {
        //If there are no dice to roll, we don't roll....
        if (stateVars.diceToRoll.length == 0) {
            return;
        }

        //Calling the DiceRoller function library to get the lowest value from our pool of dice to roll
        var dicePool = DiceRoller.dicePoolHighest(stateVars.diceToRoll, stateVars.valueToAdd);

        var newHistory = new Array(stateVars.history.length + 1);
        newHistory[0] = dicePool.description;
        for (var i = 1; i < newHistory.length; i++) {
            newHistory[i] = stateVars.history[i - 1];
        }

        if (newHistory.length > 20) {
            newHistory.splice(stateVars.history.length - 1, 1);
        }

        if (!dicePool.coinFlip) {
            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    history: newHistory,
                    mostRecentRoll: dicePool.highest,
                    coinFlip: dicePool.coinFlip
                });
            })
        }
        else {
            var coinResult = "";

            if (dicePool.numHeads > 0) {
                coinResult = "Heads";
            }
            else {
                coinResult = "Tails";
            }

            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    history: newHistory,
                    mostRecentRoll: coinResult,
                    coinFlip: dicePool.coinFlip
                });
            })
        }
    }


    //Function called from the Roll Low button in the input view to roll the dice and take the lowest value
    function RollDiceLowest() {
        //If there are no dice to roll, we don't roll....
        if (stateVars.diceToRoll.length == 0) {
            return;
        }

        //Calling the DiceRoller function library to get the lowest value from our pool of dice to roll
        var dicePool = DiceRoller.dicePoolLowest(stateVars.diceToRoll, stateVars.valueToAdd);

        var newHistory = new Array(stateVars.history.length + 1);
        newHistory[0] = dicePool.description;
        for (var i = 1; i < newHistory.length; i++) {
            newHistory[i] = stateVars.history[i - 1];
        }

        if (newHistory.length > 20) {
            newHistory.splice(stateVars.history.length - 1, 1);
        }

        if (!dicePool.coinFlip) {
            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    history: newHistory,
                    mostRecentRoll: dicePool.lowest,
                    coinFlip: dicePool.coinFlip
                });
            })
        }
        else {
            var coinResult = "";

            if (dicePool.numHeads == stateVars.diceToRoll.length) {
                coinResult = "Heads";
            }
            else {
                coinResult = "Tails";
            }

            setStateVars((prevState) => {
                return ({
                    ...prevState,
                    history: newHistory,
                    mostRecentRoll: coinResult,
                    coinFlip: dicePool.coinFlip
                });
            })
        }
    }



    return (
        <ImageBackground style={{ flex: 1 }} source={require('../assets/backgrounds/icrpg_background.png')}>
            <DefaultNavBar navigation={props.navigation} title={"DICE ROLLER"}/>

            <ScrollView style={styles.content}>
                <View style={styles.displayView}>
                    {/*Results Circle*/}
                    <ImageBackground source={require('../assets/decals/diceResultBG.png')} style={styles.resultBGImage}>
                        <Text style={styles.totalText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Result</Text>

                        {(!stateVars.coinFlip) && <Text style={(parseInt(stateVars.mostRecentRoll) > 1000) ? styles.resultTextSmall : styles.resultText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.mostRecentRoll}</Text>}

                        {(stateVars.coinFlip) && <Text style={styles.coinResultText}
                            allowFontScaling={Fonts.allowScaling}
                            maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{stateVars.mostRecentRoll}</Text>}
                    </ImageBackground>

                    {/*Dice To Roll*/}
                    <View style={styles.sectionWrapper}>
                        <TouchableOpacity style={styles.headerButton} onPress={() => setStateVars(prevState => {
                            return ({
                                ...prevState,
                                showDiceToRoll: !stateVars.showDiceToRoll
                            });
                        })}>
                            <Image style={styles.headerBG} source={require('../assets/decals/headerBar.png')} />
                            <Text style={styles.header}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Dice To Roll</Text>
                            {(stateVars.showDiceToRoll) && <ArrowDown height={25} width={25} />}
                            {(!stateVars.showDiceToRoll) && <ArrowUp height={25} width={25} />}
                        </TouchableOpacity>

                        {(!stateVars.showDiceToRoll) && <Image style={styles.collapsedImage} source={require('../assets/decals/blackBar1.png')} />}

                        {(stateVars.showDiceToRoll) && <ContentBox style={styles.dropdownContent}>
                            <View style={styles.dicePoolWrapper}>
                                {stateVars.diceToRoll.map((entry_, index_) => {
                                    switch (entry_) {
                                        case 2:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <CoinIcon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 4:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D4Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 6:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D6Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 8:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D8Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 10:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D10Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 12:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D12Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 20:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D20Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                        case 100:
                                            return (<TouchableOpacity style={styles.dicePoolButton} key={index_} onPress={() => RemoveDiceToRoll(index_)}>
                                                <D100Icon height={35} width={35} />
                                            </TouchableOpacity>);
                                            break;
                                    }
                                })}
                            </View>

                            {(stateVars.diceToRoll.length > 0) && <Text style={styles.diceSelectText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Tap a die to remove it</Text>}
                            {(stateVars.diceToRoll.length == 0) && <View style={{ height: 35 }}>
                                <Text style={styles.diceSelectText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Select up to 20 dice to roll</Text>
                            </View>}

                            <View style={styles.valueToAddWrapper}>
                                <Text style={styles.valueToAddText}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Value To Add:</Text>
                                <TextInput
                                    style={styles.valueToAddInput}
                                    defaultValue={(stateVars.editNumberID == 1) ? (stateVars.tempNumberInput) : ("" + stateVars.valueToAdd)}
                                    keyboardType={'number-pad'}
                                    placeholder={"0"}
                                    allowFontScaling={Fonts.allowScaling}
                                    maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}
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
                                                    valueToAdd: newVal,
                                                    editNumberID: 0,
                                                    requireUpdate: true
                                                });
                                            });
                                        }
                                        else if (stateVars.tempNumberInput == "") {
                                            setStateVars((prevState) => {
                                                return ({
                                                    ...prevState,
                                                    valueToAdd: 0,
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
                        </ContentBox>}
                    </View>

                    {/*History*/}
                    <View style={styles.sectionWrapper}>
                        <TouchableOpacity style={styles.headerButton}  onPress={() => setStateVars(prevState => {
                            return ({
                                ...prevState,
                                showHistory: !stateVars.showHistory
                            });
                        })}>
                            <Image style={styles.headerBG} source={require('../assets/decals/headerBar.png')} />
                            <Text style={styles.header}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>History</Text>
                            {(stateVars.showHistory) && <ArrowDown height={25} width={25} />}
                            {(!stateVars.showHistory) && <ArrowUp height={25} width={25} />}
                        </TouchableOpacity>

                        {(!stateVars.showHistory || stateVars.history.length == 0) && <Image style={styles.collapsedImage} source={require('../assets/decals/blackBar1.png')} />}

                        {(stateVars.showHistory && stateVars.history.length > 0) && <ContentBox>
                            <ScrollView style={styles.scrollView}>
                                {stateVars.history.map((entry_, index_) => {
                                    return (<Text style={styles.historyText}
                                        key={index_}
                                        allowFontScaling={Fonts.allowScaling}
                                        maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>{entry_}</Text>)
                                })}

                                {/*Padding for the content box to look good if there aren't enough history entries*/}
                                {(stateVars.history.length == 1) && <View style={{height: 24}}/>}
                            </ScrollView>
                        </ContentBox>}
                    </View>
                </View>
            </ScrollView>

            {/*Input*/}
            <View style={styles.inputView}>
                <Image source={require('../assets/decals/blackBar3.png')} style={styles.inputLine}/>

                <ScrollView horizontal={true}>
                    <View style={styles.buttonRow}>
                        {/*Coin*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(2)}>
                            <CoinIcon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>Coin</Text>
                        </TouchableOpacity>
                        {/*D4*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(4)}>
                            <D4Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D4</Text>
                        </TouchableOpacity>
                        {/*D6*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(6)}>
                            <D6Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D6</Text>
                        </TouchableOpacity>
                        {/*D8*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(8)}>
                            <D8Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D8</Text>
                        </TouchableOpacity>
                        {/*D10*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(10)}>
                            <D10Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D10</Text>
                        </TouchableOpacity>
                        {/*D12*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(12)}>
                            <D12Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D12</Text>
                        </TouchableOpacity>
                        {/*D20*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(20)}>
                            <D20Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D20</Text>
                        </TouchableOpacity>
                        {/*D100*/}
                        <TouchableOpacity style={styles.button} onPress={() => AddDieToRollList(100)}>
                            <D100Icon height={40} width={40} />
                            <Text style={styles.buttonText}
                                allowFontScaling={Fonts.allowScaling}
                                maxFontSizeMultiplier={Fonts.maxFontSizeMultiplier}>D100</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>

                <View style={styles.pickerRow}>
                    <View style={styles.pickerBG}>
                        <Picker style={styles.picker}
                            selectedValue={stateVars.rollType}
                            onValueChange={(itemValue, itemIndex) => setStateVars((prevState) => {
                                return ({
                                    ...prevState,
                                    rollType: itemValue
                                });
                            })}
                        >
                            <Picker.Item label={"Sum Results"} value={0} />
                            <Picker.Item label={"Highest Result"} value={1} />
                            <Picker.Item label={"Lowest Results"} value={2} />
                        </Picker>
                    </View>
                    <DefaultButton buttonText={"ROLL"} style={{flex: 2}} onPress={() => {
                        switch (stateVars.rollType) {
                            case 0:
                                RollDiceTotal();
                                break;
                            case 1:
                                RollDiceHighest();
                                break;
                            case 2:
                                RollDiceLowest();
                                break;
                        }
                    }} />
                </View>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: Colors.defaultBG
    },

    content: {
        flex: 1
    },

    sectionWrapper: {
        marginBottom: 10,
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

    displayView: {
        flex: 1, 
        padding: 15
    },

    resultBGImage: {
        alignSelf: 'center',
        height: 130,
        width: 155,
        paddingTop: 8,
        paddingLeft: 4,
        marginBottom: 15,
    },

    totalText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.shelf,
        fontSize: 16,
        marginTop: 5,
        textAlign: 'center',
    },

    resultText: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.shelf,
        fontSize: 54,
        width: '100%',
        textAlign: 'center',
    },

    resultTextSmall: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.shelf,
        fontSize: 44,
        paddingTop: 5,
        width: '100%',
        textAlign: 'center',
    },

    coinResultText: {
        fontFamily: Fonts.icrpgFont3,
        color: Colors.shelf,
        fontSize: 32,
        paddingTop: 10,
        width: '100%',
        textAlign: 'center',
    },

    scrollHeader: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.defaultText,
        fontSize: 18,
        marginTop: 10,
    },

    scrollView: {
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
        marginTop: 5,
        marginBottom: 5,
    },

    historyText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.defaultText,
        fontSize: 17,
        backgroundColor: Colors.icrpgInputBG,
        marginBottom: 8,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 5,
    },

    inputView: {
        padding: 15,
        paddingBottom: 20,
    },

    buttonRow: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: Colors.icrpgInputBG,
        borderRadius: 10,
        marginBottom: 10,
    },

    button: {
        paddingLeft: 5,
        paddingRight: 5,
        alignItems: 'center',
    },

    buttonText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.icrpgText,
        fontSize: 14,
    },

    dicePoolWrapper: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignSelf: 'center',
        paddingBottom: 10,
        width: '100%',
    },

    dicePoolButton: {
        paddingLeft: 5,
        paddingRight: 5,
    },

    diceSelectText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.defaultText,
        fontSize: 14,
        textAlignVertical: 'center',
        alignSelf: 'center',
    },

    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly'
    },

    pickerBG: {
        flex: 3,
        backgroundColor: Colors.icrpgInputBG,
        borderRadius: 10,
    },

    picker: {
        flex: 1,
    },

    valueToAddWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 5,
    },

    valueToAddText: {
        fontFamily: Fonts.icrpgFont2,
        color: Colors.defaultText,
        fontSize: 18,
        paddingRight: 10,
        paddingTop: 5,
        paddingBottom: 5,
    },

    valueToAddInput: {
        fontFamily: Fonts.mainFont,
        fontSize: 20,
        color: Colors.defaultText,
        height: '100%',
        width: '30%',
        backgroundColor: Colors.icrpgInputBG,
        textAlignVertical: 'center',
        textAlign: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomWidth: 1,
        borderColor: Colors.defaultText,
    },

    collapsedImage: {
        marginTop: 10,
        alignSelf: 'center',
    },

    inputLine: {
        position: 'absolute',
        top: 0,
        width: '120%',
        alignSelf: 'center',
    }
});

export default DieRollerScreen;
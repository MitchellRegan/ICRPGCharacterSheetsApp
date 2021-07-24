import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Colors from './constants/Colors';
import { AppLoading } from 'expo';
import FontLoader from './functions/fonts/FontLoader';

import MainDrawer from './components/drawerMenus/MainDrawer';
import HomeScreen from './screens/HomeScreen';
import RPGSelectScreen from './screens/RPGSelectScreen';
import DieRollerScreen from './screens/DieRollerScreen';
import ErrorScreen from './screens/ErrorScreen';

import ICRPGSheetScreen from './screens/charSheets/ICRPGSheetScreen';

//Setting up the drawer menu that swipes out from the right
const Drawer = createDrawerNavigator();

export default function App() {
    const [stateVars, setStateVars] = useState({
        fontsLoaded: false,
    });


    //Using the FontLoader function to make sure all of the custom fonts are loaded before displaying the app
    if (!stateVars.fontsLoaded) {
        FontLoader.loadAllFonts()
            .then(() => {
                setStateVars((prevState) => {
                    return ({
                        ...prevState,
                        fontsLoaded: true
                    });
                });
            })
            .catch((error) => {
                console.log("Fonts weren't loaded in App.js");
            })
    }



    return (
        <View style={styles.container}>
            {stateVars.fontsLoaded && <NavigationContainer>
                <Drawer.Navigator
                    drawerPosition={'right'}
                    drawerContent={props => <MainDrawer {...props} />}
                >
                    <Drawer.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
                    <Drawer.Screen name="RPG Select" component={RPGSelectScreen} options={{headerShown: false}}/>
                    <Drawer.Screen name="Die Roller" component={DieRollerScreen} options={{ headerShown: false }}/>
                    <Drawer.Screen name="ICRPG Sheet" component={ICRPGSheetScreen} options={{ headerShown: false }}/>
                    <Drawer.Screen name="Error" component={ErrorScreen} options={{ headerShown: false }}/>
                </Drawer.Navigator>
            </NavigationContainer>}
            {!stateVars.fontsLoaded && <AppLoading />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.shelf,
        paddingTop: 30,
    },
});

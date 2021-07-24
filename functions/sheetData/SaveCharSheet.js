import AsyncStorage from '@react-native-community/async-storage'
import AsyncVarNames from '../../constants/AsyncVarNames';

const SaveCharSheet = {
    /**
     * //Deletes the character sheet with the given charID, charName, and gameID
     * @param {int} charID
     * @param {string} charName
     * @param {int} gameID
     */
    saveCharacter: async function (updatedCharacterSheet, sheetID = -1) {
        //Object returned for if this character was successfully updated
        let returnData = AsyncStorage.getItem(AsyncVarNames.charSheetsArray)
            .then((data) => {
                var dataArray = JSON.parse(data);

                //Finding the array index of the sheet we need to save
                var indexToSave = this.getCharIndex(sheetID, dataArray);

                //If the index to save is valid then we can update that character sheet
                if (indexToSave > -1) {
                    dataArray[indexToSave] = updatedCharacterSheet;

                    let data = AsyncStorage.setItem(AsyncVarNames.charSheetsArray, JSON.stringify(dataArray))
                        .then(() => {
                            return {
                                errorMessage: "",
                                wasSaved: true
                            };
                        })
                        .catch((error) => {
                            return {
                                errorMessage: "Error saving the character data to AsyncStorage",
                                wasSaved: false
                            };
                        })

                    return data;
                }
                //If the index wasn't found, then we can't update the character
                else {
                    return {
                        wasSaved: false,
                        errorMessage: "The selected character sheet to save wasn't found."
                    };
                }
            })
            .catch((error) => {
                return {
                    wasSaved: false,
                    errorMessage: "Error updating the character sheet save data in AsyncStorage"
                };
            })

        return returnData;
    },

    /**
     * Helper function called by save to get the index of the character we need to save. Returns -1 if the character wasn't found
     * @param {int} sheetID
     * @param {string} charName
     * @param {int} gameID
     * @param {Array} charArray
     */
    getCharIndex: function (sheetID, charArray = []) {
        //Var for the index of the character sheet that needs to be deleted
        var charIndex = -1;

        for (var i = 0; i < charArray.length; i++) {
            //Making sure the character sheet has the correct sheetID
            if (charArray[i].sheetID != null && charArray[i].sheetID == sheetID) {
                charIndex = i;
                break;
            }
        }

        return charIndex;
    }
}

export default SaveCharSheet;
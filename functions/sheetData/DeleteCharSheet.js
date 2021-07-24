import AsyncStorage from '@react-native-community/async-storage'
import AsyncVarNames from '../../constants/AsyncVarNames';

const DeleteCharSheet = {
    /**
     * //Deletes the character sheet with the given charID, charName, and gameID
     * @param {int} charID
     * @param {string} charName
     * @param {int} gameID
     */
    deleteCharacter: async function (sheetID = -1, charName = "", gameID = -1) {
        //Object returned for if this character was successfully deleted
        let returnData = AsyncStorage.getItem(AsyncVarNames.charSheetsArray)
            .then((data) => {
                var dataArray = JSON.parse(data);

                //Finding the array index of the sheet we need to delete
                var indexToDelete = this.getCharIndex(sheetID, charName, gameID, dataArray);

                //If the index to delete is valid then we can delete that character sheet
                if (indexToDelete > -1) {
                    //Clearing and removing this character sheet from the array
                    dataArray[indexToDelete] = {};
                    dataArray.splice(indexToDelete, 1);

                    let data = AsyncStorage.setItem(AsyncVarNames.charSheetsArray, JSON.stringify(dataArray))
                        .then(() => {
                            return {
                                errorMessage: "",
                                wasDeleted: true
                            };
                        })
                        .catch((error) => {
                            return {
                                errorMessage: "Error deleting the character data from AsyncStorage",
                                wasDeleted: false
                            };
                        })

                    return data;
                }
                //If the index wasn't found, then we can't delete the character
                else {
                    return {
                        errorMessage: "The selected character sheet to delete wasn't found.",
                        wasDeleted: false
                    };
                }
            })
            .catch((error) => {
                return {
                    errorMessage: "Error updating the character sheet save data in AsyncStorage",
                    wasDeleted: false
                };
            })

        return returnData;
    },

    /**
     * Helper function called by delete to get the index of the character we need to delete. Returns -1 if the character wasn't found
     * @param {int} sheetID
     * @param {string} charName
     * @param {int} gameID
     * @param {Array} charArray
     */
    getCharIndex: function (sheetID, charName, gameID, charArray = []) {
        //Var for the index of the character sheet that needs to be deleted
        var charIndex = -1;

        for (var i = 0; i < charArray.length; i++) {
            //Making sure the character sheet has the correct gameID first
            if (charArray[i].gameID == gameID) {
                if (charArray[i].sheetID != null && charArray[i].sheetID == sheetID) {
                    charIndex = i;
                    break;
                }
                //If the sheetID doesn't exist then we check for the character name
                else if (charArray[i].sheetID == null && charArray[i].name == charName) {
                    charIndex = i;
                    break;
                }
            }
        }

        return charIndex;
    }
}

export default DeleteCharSheet;
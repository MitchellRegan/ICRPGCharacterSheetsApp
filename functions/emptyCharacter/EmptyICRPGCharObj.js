import TableTopGames from '../../enums/shared/tableTopGames';

const EmptyICRPGCharObj = {
    create: function (name_ = "", className = "", bioForm = "", story = "") {
        var creationDate = new Date();

        var characterObj = {
            "sheetID": Math.random() * Number.MAX_SAFE_INTEGER,
            "gameID": TableTopGames.ICRPG,
            "createdDate": creationDate.getDate() + "/" + (creationDate.getMonth() + 1) + "/" + creationDate.getFullYear(),

            "portraitURI": "",
            "name": name_,
            "class": className,
            "bioForm": bioForm,
            "story": story,

            "heroCoin": false,

            "hitPoints": {
                "current": 10,
                "max": 10,
                "deathCount": 0
            },

            "abilityScores": {
                "str": 0,
                "dex": 0,
                "con": 0,
                "int": 0,
                "wis": 0,
                "cha": 0
            },

            "effort": {
                "basic": 0,
                "weaponDamage": 0,
                "gunDamage": 0,
                "magicEffect": 0,
                "ultimate": 0
            },

            "lootBonuses": {
                "str": 0,
                "dex": 0,
                "con": 0,
                "int": 0,
                "wis": 0,
                "cha": 0,
                "armor": 0,
                "basicEffort": 0,
                "weaponDamage": 0,
                "gunDamage": 0,
                "magicEffect": 0,
                "ultimate": 0
            },

            "loot": [],
            "coin": 0,

            "abilities": [],
            "powers": [],
            "augments": [],
            "notes": [],

            "mastery": {
                "currentCount": 0,
                "masteriesCompleted": 0
            }
        }

        return characterObj;
    }
}

export default EmptyICRPGCharObj;
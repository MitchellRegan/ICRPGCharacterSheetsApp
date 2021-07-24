const DiceRoller = {
    //Rolls a die/dice and returns an int value between 1 and the value of numSides (minimum of 1)
    roll: function (numSides_ = 1, numDice_ = 1) {
        if (numSides_ < 2) {
            return 1;
        }

        //Total sum of all dice rolled
        var total = 0;

        //Rolling as many dice as we need
        for (var i = 0; i < numDice_; i++) {
            //Getting a random value between 1 and the number of sides that our die has
            var dieValue = Math.floor(Math.random() * numSides_) + 1;

            total += dieValue;
        }

        //console.log("DiceRoller.roll " + numDice_ + " d" + numSides_ + " result: " + total);
        return total;
    },

    //Rolls all dice in an array and returns an object with the sum of all results
    dicePoolSum: function (dicePool_ = [], valueToAdd_ = 0) {
        //Sum of the dice rolls (not including coins)
        var total = 0;
        var description = "SUM: ";
        //Var for if only coins are being flipped and tracking the number of Heads
        var coinFlip = true;
        var numHeads = 0;

        for (var i = 0; i < dicePool_.length; i++) {
            var result = this.roll(dicePool_[i], 1);

            //If the "die" that's being rolled is actually a coin flip
            if (dicePool_[i] == 2) {
                if (result == 1) {
                    description += "Coin: Heads, ";
                    numHeads += 1;
                }
                else {
                    description += "Coin: Tails, ";
                }
            }
            else {
                coinFlip = false;
                total = total + result;
                description += "D" + dicePool_[i] + ": " + result + ", ";
            }
        }

        if (valueToAdd_ != 0) {
            description += "Added Value: " + valueToAdd_ + ", ";
        }

        //Adding the valueToAdd if it wasn't just a coin flip
        if (!coinFlip) {
            total = total + valueToAdd_;
            description += " TOTAL: " + total;
        }
        else {
            description += " RESULT: " + numHeads + "H / " + (dicePool_.length - numHeads) + "T";
        }

        return ({
            "total": total,
            "description": description,
            "coinFlip": coinFlip,
            "numHeads": numHeads
        });
    },

    //Rolls all dice in an array and returns an object with the value of the highest die
    dicePoolHighest: function (dicePool_ = [], valueToAdd_ = 0) {
        //Var to hold the highest value of any die rolled (not including coins)
        var highest = 0;
        var description = "HIGHEST: ";
        //Var for if only coins are being flipped and tracking the number of Heads
        var coinFlip = true;
        var numHeads = 0;

        for (var i = 0; i < dicePool_.length; i++) {
            var result = this.roll(dicePool_[i], 1);

            //If the "die" that's being rolled is actually a coin flip
            if (dicePool_[i] == 2) {
                if (result == 1) {
                    description += "Coin: Heads, ";
                    numHeads += 1;
                }
                else {
                    description += "Coin: Tails, ";
                }
            }
            else {
                coinFlip = false;
                if (result > highest) {
                    highest = result;
                }
                description += "D" + dicePool_[i] + ": " + result + ", ";
            }
        }

        if (!coinFlip && valueToAdd_ != 0) {
            description += "Added Value: " + valueToAdd_ + ", ";
            highest = highest + valueToAdd_;
        }

        if (!coinFlip) {
            description += " HIGHEST: " + highest;
        }
        else {
            description += " RESULT: " + numHeads + "H / " + (dicePool_.length - numHeads) + "T";
        }

        return ({
            "highest": highest,
            "description": description,
            "coinFlip": coinFlip,
            "numHeads": numHeads
        });
    },

    //Rolls all dice in an array and returns an object with the value of the lowest die
    dicePoolLowest: function (dicePool_ = [], valueToAdd_ = 0) {
        var lowest = null;
        var description = "LOWEST: ";
        //Var for if only coins are being flipped and tracking the number of Heads
        var coinFlip = true;
        var numHeads = 0;

        for (var i = 0; i < dicePool_.length; i++) {
            var result = this.roll(dicePool_[i], 1);

            //If the "die" that's being rolled is actually a coin flip
            if (dicePool_[i] == 2) {
                if (result == 1) {
                    description += "Coin: Heads, ";
                    numHeads += 1;
                }
                else {
                    description += "Coin: Tails, ";
                }
            }
            else {
                coinFlip = false;
                if (lowest == null || result < lowest) {
                    lowest = result;
                }
                description += "D" + dicePool_[i] + ": " + result + ", ";
            }
        }

        if (!coinFlip && valueToAdd_ != 0) {
            description += "Added Value: " + valueToAdd_ + ", ";
            lowest = lowest + valueToAdd_;
        }

        if (!coinFlip) {
            description += " LOWEST: " + lowest;
        }
        else {
            description += " RESULT: " + numHeads + "H / " + (dicePool_.length - numHeads) + "T";
        }

        return ({
            "lowest": lowest,
            "description": description,
            "coinFlip": coinFlip,
            "numHeads": numHeads
        });
    }
}

export default DiceRoller;
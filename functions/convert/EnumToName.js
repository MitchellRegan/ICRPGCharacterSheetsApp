import TableTopGames from '../../enums/shared/tableTopGames';

const EnumToName = {
    TableTopGame: function (gameID_) {
        var name = "";

        switch (gameID_) {
            case TableTopGames.Starfinder:
                name = "Starfinder";
                break;
            case TableTopGames.Pathfinder_1e:
                name = "Pathfinder 1e";
                break;
            case TableTopGames.Pathfinder_2e:
                name = "Pathfinder 2e";
                break;
            case TableTopGames.DnD_3_5:
                name = "D&D 3.5";
                break;
            case TableTopGames.DnD_4e:
                name = "D&D 4e";
                break;
            case TableTopGames.DnD_5e:
                name = "D&D 5e";
                break;
            case TableTopGames.ICRPG:
                name = "ICRPG";
                break;
            default:
                name = "UNDEFINED GAME";
                break;
        }

        return name;
    }
}

export default EnumToName;
import { EScoreboardDisplayType } from '../enums/EScoreboardDisplayType';
import { EScoreboardRankIcon } from '../enums/EScoreboardRankIcon';

export default interface IScoreboardRow {
    color: number;
    friendType: string;
    mugshotOverlayText: string;
    mugshot: string;
    name: string;
    crew: string;
    jobPointsDisplayType: EScoreboardDisplayType;
    jobPoints: number;
    rankIcon: EScoreboardRankIcon;
    rank: number;
}

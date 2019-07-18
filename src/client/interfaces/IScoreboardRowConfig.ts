import { EScoreboardDisplayType } from '../enums/EScoreboardDisplayType';
import { EScoreboardRankIcon } from '../enums/EScoreboardRankIcon';

export default interface IScoreboardRowConfig {
    color?: number;
    isFriend?: boolean;
    mugshotOverlayText?: string;
    mugshot?: string;
    crew?: string;
    jobPointsDisplayType?: EScoreboardDisplayType;
    jobPoints?: number;
    rankIcon?: EScoreboardRankIcon;
    rank?: number;
}

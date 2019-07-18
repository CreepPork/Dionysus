import ICharacter from './ICharacter';
import IInventoryItem from './IInventoryItem';
import IInventoryWeapon from './IInventoryWeapon';
import IJobRank from './IJobRank';
import ILicense from './ILicense';
import IStatistic from './IStatistic';

export default interface IPlayer {
    id: number;
    steam_id: number;
    steam_name: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    born_at: string;
    person_code: string;
    job_primary_rank_id?: number;
    job_secondary_rank_id?: number;
    money_cash: number;
    money_bank: number;
    created_at: Date;
    updated_at: Date;
    job_primary_rank?: IJobRank;
    job_secondary_rank?: IJobRank;
    licenses: ILicense[];
    statistic: IStatistic;
    inventory_weapon: IInventoryWeapon[];
    inventory_item: IInventoryItem[];
    character: ICharacter;
}

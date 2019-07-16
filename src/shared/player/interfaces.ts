export interface IJobRank {
    id: number;
    name: string;
    job_id: number;
    level: number;
    wage: number;
    created_at: Date;
    updated_at: Date;
    players: IPlayer[];
}

export interface ILicensePlayerPivot {
    player_id: number;
    license_id: number;
}

export interface ILicense {
    id: number;
    name: string;
    created_at: Date;
    updated_at: Date;
    pivot: ILicensePlayerPivot;
}

export interface IStatistic {
    id: number;
    player_id: number;
    stamina: number;
    shooting: number;
    strength: number;
    stealth: number;
    flying: number;
    driving: number;
    lung_capacity: number;
    mental_state: number;
    created_at: Date;
    updated_at: Date;
}

export interface IInventoryWeapon {
    id: number;
    player_id: number;
    name: string;
    hash: string;
    ammo_count: number;
    created_at: Date;
    updated_at: Date;
}

export interface IInventoryItem {
    id: number;
    player_id: number;
    name: string;
    hash: string;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

export interface ICharacter {
    id: number;
    player_id: number;
    position_x: number;
    position_y: number;
    position_z: number;
    created_at: Date;
    updated_at: Date;
}

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

export interface IPlayerCreate {
    steam_id: number;
    steam_name: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    born_at: string;
    person_code: string;
    money_cash: number;
    money_bank: number;
}

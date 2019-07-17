export default interface IPlayerCreate {
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

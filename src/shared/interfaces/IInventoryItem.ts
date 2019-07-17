export default interface IInventoryItem {
    id: number;
    player_id: number;
    name: string;
    hash: string;
    quantity: number;
    created_at: Date;
    updated_at: Date;
}

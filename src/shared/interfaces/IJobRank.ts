import IPlayer from './IPlayer';

export default interface IJobRank {
    id: number;
    name: string;
    job_id: number;
    level: number;
    wage: number;
    created_at: Date;
    updated_at: Date;
    players: IPlayer[];
}

import axios from 'axios';

import * as _ from 'lodash';

import IPlayer, { IPlayerCreate } from './interfaces';

export default class Player {
    public static isCreated(steamId: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            axios.get(`${process.env.API_URL}/api/players`).then(response => {
                const data: IPlayer[] = response.data;

                const player = _.find(data, p => p.steam_id === steamId);

                player ? resolve(true) : resolve(false);
            }).catch(error => reject(error));
        });
    }

    public static create(player: IPlayerCreate): Promise<IPlayer> {
        return new Promise((resolve, reject) => {
            axios.post(`${process.env.API_URL}/api/players`, player).then(response => {
                resolve(response.data);
            }).catch(error => reject(error));
        });
    }

    public static getSteamId(steamHex: string): number {
        return parseInt(steamHex.split(':')[1], 16);
    }
}

// tslint:disable: comment-format
export enum EPlayerIdentifier {
    steamHex, // steam:<hex>
    license, // license:<string>
    discord, // discord:<snowflake>
    fivem, // fivem:<number>
    xboxLive,
    live,
}

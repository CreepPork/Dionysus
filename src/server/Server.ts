import Player from '../shared/classes/Player';
import { EPlayerIdentifier } from '../shared/enums/EPlayerIdentifier';

import axios from 'axios';

import * as https from 'https';

class Server {
    constructor() {
        axios.defaults.headers.common.Authorization = `Bearer ${process.env.API_BEARER_TOKEN}`;

        if (process.env.NODE_ENV === 'development') {
            axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
        }

        onNet('dionysus:onPlayerSpawned_handlePlayerSpawn', this.onHandlePlayerSpawn);

        on('playerDropped', this.onPlayerDropped);
        on('onResourceStart', this.onResourceStart);
    }

    private async onHandlePlayerSpawn() {
        const sourceId = global.source;

        setImmediate(async () => {
            const steamId = Player.getSteamId(GetPlayerIdentifier(sourceId, EPlayerIdentifier.steamHex));
            const steamName = GetPlayerName(sourceId);

            try {
                if (! await Player.isCreated(steamId)) {
                    await Player.create({
                        born_at: '2019-07-17',
                        first_name: 'First',
                        last_name: 'Last',
                        money_bank: 0,
                        money_cash: 0,
                        person_code: '000000-00000',
                        steam_id: steamId,
                        steam_name: steamName,
                    });
                }
            } catch (error) {
                setImmediate(() => {
                    emitNet('dionysus:server_axiosFailure', sourceId, error.message);
                });
            }
        });
    }

    private onPlayerDropped(reason: string) {
        console.log(`Disconnected: ${GetPlayerName(global.source)}, reason: ${reason}`);
    }

    private onResourceStart(resourceName: string) {
        if (GetCurrentResourceName() !== resourceName) { return; }

        SetConvarReplicated('sv_maxClients', GetConvar('sv_maxClients', '32'));
    }
}

// tslint:disable-next-line: no-unused-expression
new Server();

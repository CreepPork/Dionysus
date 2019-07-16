import DateFormat from '../shared/dateFormat';
import Player, { EPlayerIdentifier } from '../shared/player/player';

import axios from 'axios';

import * as https from 'https';

class Server {
    constructor() {
        axios.defaults.headers.common.Authorization = `Bearer ${process.env.API_BEARER_TOKEN}`;

        if (process.env.NODE_ENV === 'development') {
            axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false });
        }

        onNet('dionysus:onPlayerSpawned_handlePlayerSpawn', this.onHandlePlayerSpawn);
    }

    private async onHandlePlayerSpawn() {
        const sourceId = global.source;

        setImmediate(async () => {
            const steamId = Player.getSteamId(GetPlayerIdentifier(sourceId, EPlayerIdentifier.steamHex));
            const steamName = GetPlayerName(sourceId);

            if (! await Player.isCreated(steamId)) {
                await Player.create({
                    born_at: DateFormat.format(new Date()),
                    first_name: 'First',
                    last_name: 'Last',
                    money_bank: 0,
                    money_cash: 0,
                    person_code: '000000-00000',
                    steam_id: steamId,
                    steam_name: steamName,
                });
            }
        });
    }
}

// tslint:disable-next-line: no-unused-expression
new Server();

import * as Cfx from 'fivem-js';

import Commands from './classes/Commands';
import DeathManager from './classes/DeathManager';
import Scoreboard from './classes/Scoreboard';

class Client {
    constructor() {
        on('onClientResourceStart', this.onClientResourceStart);
        on('playerSpawned', this.onPlayerSpawned);

        on('baseevents:onPlayerKilled', this.onPlayerWasted);
        on('baseevents:onPlayerDied', this.onPlayerWasted);
        on('baseevents:onPlayerWasted', this.onPlayerWasted);

        onNet('dionysus:server_axiosFailure', this.onAxiosFailure);

        if (process.env.NODE_ENV === 'development') {
            Commands.Register();
        }
    }

    private onClientResourceStart(resourceName: string) {
        if (GetCurrentResourceName() !== resourceName) { return; }

        // tslint:disable-next-line: no-unused-expression
        new Scoreboard();

        console.log('Dionysus: Client Resource Started.');
    }

    private onPlayerSpawned() {
        emitNet('dionysus:onPlayerSpawned_handlePlayerSpawn');
    }

    private onPlayerWasted() {
        DeathManager.died();
    }

    private onAxiosFailure(error: string) {
        Cfx.Screen.showNotification(`~y~Error from Dionysus API:~r~\n${error}`);
    }
}

// tslint:disable-next-line: no-unused-expression
new Client();

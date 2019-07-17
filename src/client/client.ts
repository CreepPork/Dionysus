import Commands from './commands';
import DeathManager from './deathManager';

class Client {
    constructor() {
        on('onClientResourceStart', this.onClientResourceStart);
        on('playerSpawned', this.onPlayerSpawned);

        on('baseevents:onPlayerKilled', this.onPlayerWasted);
        on('baseevents:onPlayerDied', this.onPlayerWasted);
        on('baseevents:onPlayerWasted', this.onPlayerWasted);

        if (process.env.NODE_ENV === 'development') {
            Commands.Register();
        }
    }

    private onClientResourceStart(resourceName: string) {
        if (GetCurrentResourceName() !== resourceName) { return; }

        console.log('Dionysus: Client Resource Started.');
    }

    private onPlayerSpawned() {
        emitNet('dionysus:onPlayerSpawned_handlePlayerSpawn');
    }

    private onPlayerWasted() {
        DeathManager.died();
    }
}

// tslint:disable-next-line: no-unused-expression
new Client();

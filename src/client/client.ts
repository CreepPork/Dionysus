import { Game } from 'fivem-js/lib/Game';

class Client {
    constructor() {
        on('onClientResourceStart', this.onClientResourceStart);
        on('playerSpawned', this.onPlayerSpawned);
    }

    private onClientResourceStart(resourceName: string) {
        if (GetCurrentResourceName() !== resourceName) { return; }

        console.log('Dionysus: Client Resource Started.');
    }

    private onPlayerSpawned() {
        emitNet('dionysus:onPlayerSpawned_handlePlayerSpawn');
    }
}

// tslint:disable-next-line: no-unused-expression
new Client();

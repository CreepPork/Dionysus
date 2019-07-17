import Commands from './commands/commands';

class Client {
    constructor() {
        on('onClientResourceStart', this.onClientResourceStart);
        on('playerSpawned', this.onPlayerSpawned);

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
}

// tslint:disable-next-line: no-unused-expression
new Client();

export default class NativeUi {
    private isDisplayed = false;

    constructor() {
        on('dionysus:nativeUi_toggleDisplay', () => this.toggleDisplay());
        on('onClientResourceStart', this.onClientResourceStart);
    }

    private toggleDisplay() {
        this.isDisplayed = ! this.isDisplayed;

        setImmediate(() => {
            SendNuiMessage(JSON.stringify({
                isDisplayed: this.isDisplayed,
                type: 'dionysus:nativeUi_displayType',
            }));
        });
    }

    private onClientResourceStart(resourceName: string) {
        if (GetCurrentResourceName() !== resourceName) { return; }

        console.log('Dionysus: NativeUI started');

        RegisterCommand('dionysus:toggleDisplay', () => emit('dionysus:nativeUi_toggleDisplay'), false);
    }
}

// tslint:disable-next-line: no-unused-expression
new NativeUi();

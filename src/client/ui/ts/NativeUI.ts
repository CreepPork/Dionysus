export default class NativeUI {
    private isDisplayed = false;

    constructor() {
        // Called via arrow function to keep this in the class
        on('dionysus:nativeUI_toggleDisplay', () => this.toggleDisplay());
        on('onClientResourceStart', this.onClientResourceStart);
    }

    private toggleDisplay() {
        this.isDisplayed = ! this.isDisplayed;

        setImmediate(() => {
            SendNuiMessage(JSON.stringify({
                isDisplayed: this.isDisplayed,
                type: 'dionysus:nativeUI_displayType',
            }));

            // Seems to crash the game if user interacts with content
            // SetNuiFocus(this.isDisplayed, this.isDisplayed);
        });
    }

    private onClientResourceStart(resourceName: string) {
        if (GetCurrentResourceName() !== resourceName) { return; }

        console.log('Dionysus: NativeUI started');

        RegisterCommand('dionysus:toggleDisplay', () => emit('dionysus:nativeUI_toggleDisplay'), false);
    }
}

// tslint:disable-next-line: no-unused-expression
new NativeUI();

export {};

declare global {
    export namespace NodeJS {
        interface Global {
            /**
             * Player ID for player which triggered an event.
             *
             * In natives it is referenced as a `string` but in reality it is a `number`.
             */
            source: string;
        }
    }
}

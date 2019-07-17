import * as Cfx from 'fivem-js';

import delay from '../shared/delay';

export default class DeathManager {
    public static async died() {
        // MP_Impact needs this audio bank to be loaded
        RequestScriptAudioBank('MP_WASTED', false);
        Cfx.Audio.setAudioFlag(Cfx.AudioFlag.LoadMPData, true);

        Cfx.Audio.playSoundFrontEnd('MP_Flash', 'WastedSounds');
        ShakeGameplayCam('DEATH_FAIL_IN_EFFECT_SHAKE', 1);

        const scaleform = new Cfx.Scaleform('mp_big_message_freemode');

        while (scaleform.IsLoaded === false) {
            await delay(1);
        }

        scaleform.callFunction('SHOW_SHARD_WASTED_MP_MESSAGE', [
            '~r~Wasted',
            'You died.',
            5,
        ]);

        Cfx.Audio.playSoundFrontEnd('MP_Impact', 'WastedSounds');
        StartScreenEffect('DeathFailOut', 0, true);
        while (Cfx.Game.Player.Character.isDead()) {
            scaleform.render2D();

            await delay(1);
        }

        scaleform.dispose();
        StopScreenEffect('DeathFailOut');
    }
}

import * as Cfx from 'fivem-js';
import { Vector3 } from 'fivem-js';

export default class Commands {
    public static Register() {
        RegisterCommand('tp', (source: number, args: string[]) => this.commandTeleport(args), false);
        RegisterCommand('tpw', () => this.commandTeleportToWaypoint(), false);
    }

    private static commandTeleport(args: string[]) {
        const converted: number[] = [];

        args.forEach(arg => {
            converted.push(parseFloat(arg));
        });

        Cfx.Game.PlayerPed.Position = new Vector3(converted[0], converted[1], converted[2]);
    }

    private static commandTeleportToWaypoint() {
        if (Cfx.Game.IsWaypointActive) {
            const pos = GetBlipCoords(GetFirstBlipInfoId(8));

            // 8 is id for waypoint
            Cfx.Game.PlayerPed.Position = new Vector3(
                pos[0],
                pos[1],
                0,
            );

            let height = 0;

            const intervalId = setInterval(() => {
                // FoundGround, Z position
                const ground = GetGroundZFor_3dCoord(pos[0], pos[1], height, false);
                if (ground[0] === 1) {
                    clearInterval(intervalId);
                } else {
                    height++;
                }

                Cfx.Game.PlayerPed.Position = new Vector3(pos[0], pos[1], height);
            }, 5);
        } else {
            emit('chat:addMessage', {
                args: [
                    'Dionysus',
                    'You do not have a waypoint set.',
                ],
                color: [255, 0, 0],
                multiline: true,
            });
        }
    }
}

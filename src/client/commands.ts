import * as Cfx from 'fivem-js';
import { Vector3 } from 'fivem-js';

export default class Commands {
    public static Register() {
        RegisterCommand('tp', (source: number, args: string[]) => this.commandTeleport(args), false);
        RegisterCommand('tpw', () => this.commandTeleportToWaypoint(), false);
        RegisterCommand('kill', () => this.commandKill(), false);
        RegisterCommand('giveAll', () => this.commandGiveAll(), false);
        RegisterCommand('wantedLevel', (source: number, args: string[]) => this.commandSetWantedLevel(args), false);
        RegisterCommand('pos', () => this.commandPosition(), false);
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
                    height += 3;
                }

                Cfx.Game.PlayerPed.Position = new Vector3(pos[0], pos[1], height);
            }, 1);
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

    private static commandKill() {
        Cfx.Game.Player.Character.Health = 0;
    }

    private static commandGiveAll() {
        for (const hash of Object.values(Cfx.WeaponHash)) {
            GiveWeaponToPed(
                Cfx.Game.Player.Character.Handle,
                hash,
                1e8,
                false,
                false,
            );
        }
    }

    private static commandSetWantedLevel(args: string[]) {
        let level = parseInt(args[0], 10);

        if (level > 5) { level = 5; }
        if (level < 0) { level = 0; }

        SetPlayerWantedLevel(Cfx.Game.Player.Handle, level, false);
        SetPlayerWantedLevelNow(Cfx.Game.Player.Handle, false);
    }

    private static commandPosition() {
        const pos = Cfx.Game.Player.Character.Position;
        const heading = Cfx.Game.Player.Character.Heading;

        emit('chat:addMessage', {
            args: [
                'Dionysus',
                `Position:
                    X:${pos.x.toFixed(4)},
                    Y: ${pos.y.toFixed(4)},
                    Z: ${pos.z.toFixed(4)};
                Heading: ${heading.toFixed(2)}`,
            ],
            color: [255, 0, 0],
            multiline: true,
        });
    }
}

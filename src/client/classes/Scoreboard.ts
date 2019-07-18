import { EScoreboardDisplayType } from '../enums/EScoreboardDisplayType';
import { EScoreboardRankIcon } from '../enums/EScoreboardRankIcon';
import IScoreboardRow from '../interfaces/IScoreboardRow';

import * as Cfx from 'fivem-js';
import Delay from '../../shared/utilities/Delay';
import Scaleform from '../utilities/Scaleform';

export default class Scoreboard {
    private maxClients: number = parseInt(GetConvar('sv_maxClients', '32'), 10);

    private ui?: Scaleform;
    private uiInitalized = false;
    private uiRows: IScoreboardRow[] = [];
    private uiPage = 0;
    private uiIsVisible = false;
    private uiMugshotCache: string[] = [];

    private change = (GetSafeZoneSize() - 0.89) / 0.11;

    private x = 50 - this.change * 78;
    private y = 50 - this.change * 50;
    private width = 400;
    private height = 490;

    constructor() {
        setTick(() => this.controller());
        setTick(() => this.draw());

        setTick(() => this.updateMugshots());
    }

    private async controller() {
        if (Cfx.Game.isControlJustPressed(0, Cfx.Control.MultiplayerInfo)) {
            this.uiIsVisible = ! this.uiIsVisible;

            const timer = GetGameTimer();

            while (GetGameTimer() - timer < 8000) {
                await Delay(1);

                if (Cfx.Game.isControlJustPressed(0, Cfx.Control.MultiplayerInfo)) {
                    break;
                }
            }

            this.uiIsVisible = ! this.uiIsVisible;
        }
    }

    private async draw() {
        if (this.uiIsVisible) {
            if (! this.uiInitalized) {
                await this.loadUi();

                this.uiInitalized = true;
            }

            if (this.ui) {
                if (this.ui.IsLoaded) {
                    this.ui.render2DScreenSpace(
                        new Cfx.PointF(this.x, this.y, 0),
                        new Cfx.PointF(this.width, this.height, 0),
                    );
                }
            }
        }
    }

    private async getMugshot(handle: number): Promise<string> {
        const mugshotHandle = RegisterPedheadshot(GetPlayerPed(handle));

        while (! IsPedheadshotReady(mugshotHandle) || ! IsPedheadshotValid(mugshotHandle)) {
            await Delay(1);
        }

        return GetPedheadshotTxdString(mugshotHandle) || '';
    }

    private async updateMugshots() {
        GetActivePlayers().forEach(async (id: number) => {
            this.uiMugshotCache[id] = await this.getMugshot(id);
        });

        await Delay(1000);
    }

    private cleanMugshots() {
        for (let i = 0; i < this.maxClients; i++) {
            if (IsPedheadshotValid(i)) {
                UnregisterPedheadshot(i);
            }
        }
    }

    private async clearUi() {
        if (this.ui) {
            for (let i = 0; i < this.maxClients * 2; i++) {
                this.ui.callFunction('SET_DATA_SLOT_EMPTY', [i]);
            }
        }
    }

    private async updateUi() {
        this.cleanMugshots();

        GetActivePlayers().forEach(async (id: number) => {
            const config: IScoreboardRow = {
                color: 111,
                crew: this.getCrew('crew'),
                friendType: '',
                jobPoints: 3,
                jobPointsDisplayType: EScoreboardDisplayType.Icon,
                mugshot: this.uiMugshotCache[id] || '',
                mugshotOverlayText: '',
                name: GetPlayerName(id),
                rank: GetPlayerServerId(id),
                rankIcon: EScoreboardRankIcon.RankFreemode,
            };

            this.uiRows.push(config);
        });

        await this.clearUi();

        for (const [i, row] of this.uiRows.entries()) {
            if (this.ui) {
                this.ui.callFunction('SET_DATA_SLOT', [
                    i,
                    row.rank,
                    row.name,
                    row.color,
                    row.rankIcon,
                    row.mugshotOverlayText,
                    row.jobPoints,
                    row.crew,
                    row.jobPointsDisplayType,
                    row.mugshot,
                    row.mugshot,
                    row.friendType,
                ]);
            }
        }
    }

    private async loadUi() {
        if (this.ui) {
            this.clearUi();

            this.ui.dispose();
            this.ui = undefined;
        }

        this.ui = new Scaleform('MP_MM_CARD_FREEMODE');

        while (this.ui.IsLoaded === false) {
            await Delay(1);
        }

        this.ui.callFunction('SET_TITLE', [
            'FiveM',
            `Players ${NetworkGetNumConnectedPlayers()}/${this.maxClients}`,
            2,
        ]);

        await this.updateUi();

        this.ui.callFunction('DISPLAY_VIEW', []);
    }

    private getCrew(crew: string): string {
        // It requires 3 characters to display the actual value
        return `   ${crew}`;
    }
}

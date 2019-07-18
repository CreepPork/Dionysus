import { EScoreboardDisplayType } from '../enums/EScoreboardDisplayType';
import { EScoreboardRankIcon } from '../enums/EScoreboardRankIcon';
import { EScriptGfxAlignHorizontal } from '../enums/EScriptGfxAlignHorizontal';
import { EScriptGfxAlignVertical } from '../enums/EScriptGfxAlignVertical';
import IScoreboardRow from '../interfaces/IScoreboardRow';

import Delay from '../../shared/utilities/Delay';

import * as Cfx from 'fivem-js';

export default class Scoreboard {
    private maxClients: number = parseInt(GetConvar('sv_maxClients', '32'), 10);

    private ui?: Cfx.Scaleform;
    private uiInitalized = false;
    private uiRows: IScoreboardRow[] = [];
    private uiCurrentPage = 1;
    private uiMugshotCache: string[] = [];
    private uiIsGeneratingMugshots = false;

    private get uiMaxPages(): number {
        return Math.ceil((GetActivePlayers() as number[]).length / 16);
    }

    constructor() {
        setTick(() => this.controller());
    }

    private async controller() {
        if (Cfx.Game.isControlJustPressed(0, Cfx.Control.MultiplayerInfo)) {
            this.updateMugshots();

            let timer = GetGameTimer();

            while (GetGameTimer() - timer < 8000) {
                await Delay(1);

                this.draw();

                if (Cfx.Game.isControlJustPressed(0, Cfx.Control.MultiplayerInfo)) {
                    if (this.uiCurrentPage === this.uiMaxPages) {
                        break;
                    } else {
                        this.uiCurrentPage++;
                        timer = GetGameTimer();
                        this.updateUiTitle();
                        this.updateUi();
                    }
                }
            }

            // Prevent the user seeing for a split second the page number change when it is being closed
            await Delay(1);
            this.uiCurrentPage = 1;
            this.updateUiTitle();
            this.updateUi();
        }
    }

    private async draw() {
        if (! this.uiInitalized) {
            this.uiInitalized = true;

            await this.loadUi();
        }

        if (this.ui) {
            if (this.ui.IsLoaded) {
                SetScriptGfxAlign(EScriptGfxAlignHorizontal.Left, EScriptGfxAlignVertical.Top);
                SetScriptGfxDrawOrder(7);

                this.ui.render2DScreenSpace(
                    new Cfx.PointF(-0.018, 0, 0),
                    new Cfx.PointF(0.28, 0.6, 0),
                );

                SetScriptGfxDrawOrder(4);
            }
        }
    }

    private async getMugshot(handle: number): Promise<string> {
        const mugshotHandle = RegisterPedheadshot(GetPlayerPed(handle));

        while (! IsPedheadshotReady(mugshotHandle) || ! IsPedheadshotValid(mugshotHandle)) {
            await Delay(1000);
        }

        return GetPedheadshotTxdString(mugshotHandle);
    }

    private async updateMugshots() {
        if (this.uiIsGeneratingMugshots) { return; }
        this.uiIsGeneratingMugshots = true;

        GetActivePlayers().forEach(async (id: number) => {
            this.uiMugshotCache[id] = await this.getMugshot(id);

            // Emit event for that index to update it's mugshot
        });

        await Delay(60 * 1000);
        this.uiIsGeneratingMugshots = false;
    }

    private cleanMugshots() {
        for (let i = 0; i < this.maxClients; i++) {
            UnregisterPedheadshot(i);
        }
    }

    private clearUi() {
        if (this.ui) {
            this.uiRows = [];

            for (let i = 0; i < this.maxClients; i++) {
                this.ui.callFunction('SET_DATA_SLOT_EMPTY', [i]);
            }
        }
    }

    private async updateUi() {
        console.log(this.uiCurrentPage);
        this.clearUi();

        for (const [i, id] of GetActivePlayers().entries()) {
            const row: IScoreboardRow = {
                color: 111,
                crew: `   crew`,
                isFriend: true,
                jobPoints: 3,
                jobPointsDisplayType: EScoreboardDisplayType.Icon,
                mugshot: this.uiMugshotCache[id] || '',
                mugshotOverlayText: '',
                // ToDo: Trim special characters <> ~r~ etc.
                name: GetPlayerName(id),
                rank: GetPlayerServerId(id),
                rankIcon: EScoreboardRankIcon.RankFreemode,
            };

            this.uiRows.push(row);

            if (this.ui) {
                // Handle page switching
                this.ui.callFunction('SET_DATA_SLOT', [
                    i - ((this.uiCurrentPage - 1) * 16),
                    row.rank,
                    `${row.name}${i + 1}`,
                    row.color,
                    row.rankIcon,
                    row.mugshotOverlayText,
                    row.jobPoints,
                    row.crew,
                    row.jobPointsDisplayType,
                    row.mugshot,
                    row.mugshot,
                    row.isFriend ? 'F' : '',
                ]);
            }
        }

        if (this.ui) {
            this.ui.callFunction('DISPLAY_VIEW', []);
        }
    }

    private async loadUi() {
        this.ui = new Cfx.Scaleform('MP_MM_CARD_FREEMODE');

        while (this.ui.IsLoaded === false) {
            await Delay(50);
        }

        this.cleanMugshots();
        this.updateUiTitle();
        await this.updateUi();
    }

    private updateUiTitle() {
        if (this.ui) {
            this.ui.callFunction('SET_TITLE', [
                `Players ${NetworkGetNumConnectedPlayers()}/${this.maxClients}`,
                `${this.uiCurrentPage}/${this.uiMaxPages}`,
            ]);
        }
    }
}

import { EScoreboardDisplayType } from '../enums/EScoreboardDisplayType';
import { EScoreboardRankIcon } from '../enums/EScoreboardRankIcon';
import { EScriptGfxAlignHorizontal } from '../enums/EScriptGfxAlignHorizontal';
import { EScriptGfxAlignVertical } from '../enums/EScriptGfxAlignVertical';
import IScoreboardRow from '../interfaces/IScoreboardRow';
import IScoreboardRowConfig from '../interfaces/IScoreboardRowConfig';

import Delay from '../../shared/utilities/Delay';

import * as Cfx from 'fivem-js';

export default class Scoreboard {
    private maxClients: number = parseInt(GetConvar('sv_maxClients', '32'), 10);

    private ui?: Cfx.Scaleform;
    private uiInitialized = false;
    private uiRows: IScoreboardRow[] = [];
    private uiCurrentPage = 1;
    private uiMugshotCache: string[] = [];
    private uiIsGeneratingMugshots = false;
    private uiPlayerConfigs: IScoreboardRowConfig[] = [];

    private get uiMaxPages(): number {
        return Math.ceil((GetActivePlayers() as number[]).length / 16);
    }

    constructor() {
        setTick(() => this.controller());

        on('dionysus:scoreboard_updatePlayerRow', (
                playerId: number,
                color?: number,
                crew?: string,
                isFriend?: boolean,
                jobPoints?: number,
                jobPointsDisplayType?: EScoreboardDisplayType,
                mugshot?: string,
                mugshotOverlayText?: string,
                rank?: number,
                rankIcon?: EScoreboardRankIcon,
            ) => this.onUpdatePlayerRow(
                playerId, color, crew, isFriend, jobPoints, jobPointsDisplayType,
                mugshot, mugshotOverlayText, rank, rankIcon,
            ),
        );
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
        if (! this.uiInitialized) {
            this.uiInitialized = true;

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
        let mugshotHandle = RegisterPedheadshot(GetPlayerPed(handle));

        while (! IsPedheadshotReady(mugshotHandle) || ! IsPedheadshotValid(mugshotHandle)) {
            await Delay(5000);

            if (GetPedheadshotTxdString(mugshotHandle) !== null) {
                break;
            }

            mugshotHandle = RegisterPedheadshot(GetPlayerPed(handle));
            if (GetPedheadshotTxdString(mugshotHandle) !== null) {
                break;
            }
        }

        return GetPedheadshotTxdString(mugshotHandle);
    }

    private async updateMugshots() {
        if (this.uiIsGeneratingMugshots) { return; }
        this.uiIsGeneratingMugshots = true;

        for (const id of GetActivePlayers()) {
            const mugshot = await this.getMugshot(id);
            this.uiMugshotCache[id] = mugshot;

            // Emit event for that index to update it's mugshot
            await this.onUpdatePlayerRow(id, undefined, undefined, undefined, undefined, undefined, mugshot);
        }

        await Delay(60 * 1000);
        this.uiIsGeneratingMugshots = false;
    }

    private cleanMugshots() {
        for (let i = 0; i < 150; i++) {
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
        this.clearUi();

        for (const [i, id] of GetActivePlayers().entries()) {
            const row: IScoreboardRow = {
                color: 111,
                crew: '',
                isFriend: false,
                jobPoints: 0,
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
                if (this.uiPlayerConfigs[id]) {
                    this.ui.callFunction('SET_DATA_SLOT', [
                        // This prevents undefined rows from showing
                        i - ((this.uiCurrentPage - 1) * 16),
                        this.uiPlayerConfigs[id].rank || row.rank,
                        row.name,
                        this.uiPlayerConfigs[id].color || row.color,
                        this.uiPlayerConfigs[id].rankIcon || row.rankIcon,
                        this.uiPlayerConfigs[id].mugshotOverlayText || row.mugshotOverlayText,
                        this.uiPlayerConfigs[id].jobPoints || row.jobPoints,
                        this.uiPlayerConfigs[id].crew ? `   ${this.uiPlayerConfigs[id].crew}` : row.crew,
                        this.uiPlayerConfigs[id].jobPointsDisplayType || row.jobPointsDisplayType,
                        this.uiPlayerConfigs[id].mugshot || row.mugshot,
                        this.uiPlayerConfigs[id].mugshot || row.mugshot,
                        this.uiPlayerConfigs[id].isFriend ? (this.uiPlayerConfigs[id].isFriend ? 'F' : '') : '',
                    ]);
                } else {
                    this.ui.callFunction('SET_DATA_SLOT', [
                        i - ((this.uiCurrentPage - 1) * 16),
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
                        row.isFriend ? 'F' : '',
                    ]);
                }
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

    private async onUpdatePlayerRow(
        playerId: number,
        color?: number,
        crew?: string,
        isFriend?: boolean,
        jobPoints?: number,
        jobPointsDisplayType?: EScoreboardDisplayType,
        mugshot?: string,
        mugshotOverlayText?: string,
        rank?: number,
        rankIcon?: EScoreboardRankIcon,
    ) {
        this.uiPlayerConfigs[playerId] = {
            color,
            crew,
            isFriend,
            jobPoints,
            jobPointsDisplayType,
            mugshot,
            mugshotOverlayText,
            rank,
            rankIcon,
        };

        await this.updateUi();
    }
}

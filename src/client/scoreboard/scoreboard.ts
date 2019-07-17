import * as Cfx from 'fivem-js';
import delay from '../../shared/delay';

export default class Scoreboard {
    private maxClients: number = parseInt(GetConvar('sv_maxClients', '32'), 10);

    private ui?: Cfx.Scaleform;
    private uiInitalized = false;
    private uiRows: IScoreboardRow[] = [];
    private uiPage = 0;
    private uiIsVisible = false;

    private safezone = GetSafeZoneSize(); // 0.9699
    private change = (this.safezone - 0.89) / 0.11;

    private x = 50 - this.change * 78;
    private y = 50 - this.change * 50;
    private width = 400;
    private height = 490;

    constructor() {
        setTick(() => this.controller());
        setTick(() => this.draw());
    }

    private async controller() {
        if (Cfx.Game.isControlJustPressed(0, Cfx.Control.MultiplayerInfo)) {
            this.uiIsVisible = ! this.uiIsVisible;

            const timer = GetGameTimer();

            while (GetGameTimer() - timer < 8000) {
                await delay(1);

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
                        new Cfx.PointF(-6.65, 13.68, 0),
                        new Cfx.PointF(400, 490, 0),
                    );
                }
            }
        }
    }

    private async getMugshot(handle: number): Promise<string> {
        const mugshotHandle = RegisterPedheadshot(handle);

        while (! IsPedheadshotReady(mugshotHandle)) {
            await delay(50);
        }

        return GetPedheadshotTxdString(mugshotHandle) || '';
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
                crew: 'CREW',
                friendType: '',
                jobPoints: 3,
                jobPointsDisplayType: EScoreboardDisplayType.Icon,
                mugshot: await this.getMugshot(id),
                mugshotOverlayText: '',
                name: GetPlayerName(id),
                rank: GetPlayerServerId(id),
                rankIcon: EScoreboardRankIcon.RankFreemode,
            };

            this.uiRows.push(config);
        });

        this.clearUi();

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

        this.ui = new Cfx.Scaleform('MP_MM_CARD_FREEMODE');

        while (this.ui.IsLoaded === false) {
            await delay(1);
        }

        this.ui.callFunction('SET_TITLE', [
            'FiveM',
            `Players ${NetworkGetNumConnectedPlayers()}/${this.maxClients}`,
            2,
        ]);

        await this.updateUi();

        this.ui.callFunction('DISPLAY_VIEW', []);
    }
}

interface IScoreboardRow {
    color: number;
    friendType: string;
    mugshotOverlayText: string;
    mugshot: string;
    name: string;
    crew: string;
    jobPointsDisplayType: EScoreboardDisplayType;
    jobPoints: number;
    rankIcon: EScoreboardRankIcon;
    rank: number;
}

enum EScoreboardDisplayType {
    NumberOnly,
    Icon,
    None,
}

enum EScoreboardRankIcon {
    None,
    ActiveHeadset = 47,
    InactiveHeadset,
    MutedHeadset,
    Kick = 64,
    RankFreemode,
    Spectator,
    LobbyDriver = 79,
    LobbyCoDriver,
    Bounty = 115,
    Dead,
    GangCEO = 121,
    GangBiker,
    GangDownTarget,
}

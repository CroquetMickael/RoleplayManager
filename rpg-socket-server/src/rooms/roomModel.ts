import { PlayerModel } from "../player/playerModel";

export interface RoomModel {
    maxPlayer: number,
    owner: string,
    players: Array<PlayerModel>,
    password: string,
    lastUsedDate: Date,
    isOwnerConnected: boolean,
}

export type RoomObject = { [key: string]: RoomModel };
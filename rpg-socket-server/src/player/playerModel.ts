import { SpellModel } from "../spells/spellModel";

export interface PlayerModel {
    spells: Array<SpellModel>,
    name: string
}
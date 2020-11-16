interface SpellModel {
    name: string,
    defaultCooldown: number,
    currentCooldown: number,
    description: string
}

interface SpellAddModel {
    spellName: string,
    spellCooldown: string,
    spellDescription: string
}

type SpellObject = { [key: string]: SpellModel };

export { SpellModel, SpellObject, SpellAddModel }
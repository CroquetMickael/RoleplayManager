import { checkIfStringisNullOrEmpty } from '../../Helper/helper'

function checkSpellInputs (spellName: string, spellDescription: string, spellCooldown: string) {
  if (
    !checkIfStringisNullOrEmpty(spellName) &&
    !checkIfStringisNullOrEmpty(spellDescription) &&
    !checkIfStringisNullOrEmpty(spellCooldown)
  ) {
    return true
  }
  return false
}

export { checkSpellInputs }

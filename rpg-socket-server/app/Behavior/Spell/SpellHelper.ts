const checkIfStringisNullOrEmpty = (string: string) => {
  if (string === '' || string === null) {
    return true
  }
  return false
}

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

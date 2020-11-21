const checkIfStringisNullOrEmpty = (string: string) => {
  if (string === '' || string === null) {
    return true
  }
  return false
}

function applyMixins (derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        /*@ts-ignore*/
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      )
    })
  })
}

export { checkIfStringisNullOrEmpty, applyMixins }


const checkIfStringisNullOrEmpty = (string: string) => {
  if (string === "" || string === null) {
    return true;
  }
  return false;
};

export { checkIfStringisNullOrEmpty };

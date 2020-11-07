const checkIfStringisNullOrEmpty = (string) => {
  if (string === "" || string === null) {
    return true;
  }
  return false;
};

module.exports = {
  checkIfStringisNullOrEmpty,
};

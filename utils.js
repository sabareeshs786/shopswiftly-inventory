function getNonNullUndefinedProperties(obj) {
  const result = {};

  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const value = obj[prop];
      if (value !== null && value !== undefined && value != "") {
        result[prop] = value;
      }
    }
  }

  return result;
}

function isvalidInputData(dataObject) {
  for (const prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      const value = obj[prop];
      if (!Boolean(value)) {
        return false
      }
    }
  }
  return true;
}

module.exports = { getNonNullUndefinedProperties, isvalidInputData };
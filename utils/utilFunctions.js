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
  for (const prop in dataObject) {
    if (dataObject.hasOwnProperty(prop)) {
      const value = dataObject[prop];
      if (!Boolean(value)) {
        return false;
      }
    }
  }
  return true;
}

const removeEmptyFields = (fields) => {
  for (const key of Object.keys(fields)) {
      let value = fields[key];
      if (typeof value === 'object' && value !== null) {
          let retObj = removeEmptyFields(value);
          if (Object.keys(retObj).length === 0)
              delete fields[key]
      }
      else {
          if (!value)
              delete fields[key];
      }
  }
  return fields;
}

module.exports = { getNonNullUndefinedProperties, isvalidInputData, removeEmptyFields };
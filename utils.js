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

module.exports = {getNonNullUndefinedProperties};
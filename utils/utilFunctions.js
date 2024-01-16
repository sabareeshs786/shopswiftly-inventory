const url = require('url');
const querystring = require('querystring');

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
    else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (typeof value[i] === 'object' && value[i] !== null) {
          value[i] = removeEmptyFields(value[i]);
          if (Object.keys(value[i]).length === 0)
            value.splice(i, 1);
        }
        else {
          if (!value[i])
            value.splice(i, 1);
        }
      }

    }
    else {
      if (!value)
        delete fields[key];
    }
  }
  return fields;
}

const getGenericFilters = (req) => {
  const parsedUrl = url.parse(req.url);
  const queryParams = querystring.parse(parsedUrl.query);
  const brand = req.query.brand?.split(',');
  const minPrice = queryParams['min-price'];
  const maxPrice = queryParams['max-price'];
  const mongodbQuery = { $and: [{ price: { $gte: minPrice } }, { price: { $lte: maxPrice } }], brand: { $in: brand } };
  const genFields = [
    "skuid", "disname", "desc", "bcCode", "catePath",
    "sp", "mp", "offer", "currency", "rating", "noOfRatings",
    "reviews", "noOfReviews", "keywords", "highlights",
    "availability", "sellers", "offer"
  ]
  return { mongodbQuery, genFields };
}

const strValToNumVal = (obj) => {
  Object.entries(obj).forEach(([key, val]) => {
      obj[key] = Number(val);
  });
  return Object.fromEntries(Object.entries(obj).filter(([key, value]) => !Number.isNaN(value)));
};

const strValToNumArr = (str) => {
  const strArr = str.split(',');
  console.log(strArr)
  let numArr = strArr.map((s) => Number(s));
  console.log(numArr);
  numArr = numArr.filter((num) => !Number.isNaN(num) && num !== 0);
  return numArr.map((n) => Number.parseInt(n, 10));
}

module.exports = { isvalidInputData, removeEmptyFields, getGenericFilters, strValToNumVal, strValToNumArr };
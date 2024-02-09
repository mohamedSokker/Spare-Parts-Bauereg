export const getDistinctObjects = (arr, key) => {
  const seen = new Map(); // You can also use an object (const seen = {})

  return arr.reduce((uniqueObjects, currentObject) => {
    const identifier = key ? currentObject[key] : JSON.stringify(currentObject);

    if (!seen.has(identifier)) {
      seen.set(identifier, true);
      uniqueObjects.push(currentObject);
    }

    return uniqueObjects;
  }, []);
};

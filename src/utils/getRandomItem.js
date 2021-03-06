export function getRandomKeyFromObj(obj) {
  var keys = Object.keys(obj);
  return obj[keys[(keys.length * Math.random()) << 0]];
}

export function getRandomItemFromArr(items) {
  if (!items || !items.length) {
    return items;
  }

  return items[Math.floor(Math.random() * items.length)];
}

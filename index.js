module.exports.parse = function (buffer) {
  if (buffer == null) {
   return null;
  }
  var message = buffer.toString();
  
  try {
    return JSON.parse(message);
  } catch (err) {}
  return message;
};

var isOwnDescendant = function (object, ancestors) {
  for (var i in ancestors) {
    if (ancestors[i] === object) {
      return true;
    }
  }
  return false;
};

var convertBuffersToBase64 = function (object, ancestors) {
  if (!ancestors) {
    ancestors = [];
  }
  if (isOwnDescendant(object, ancestors)) {
    throw new Error('Cannot traverse circular structure');
  }
  var newAncestors = ancestors.concat([object]);

  if (object instanceof Buffer) {
    object = {
      base64: true,
      data: object.toString('base64')
    };
  } else if (object instanceof Array) {
    for (var i in object) {
      object[i] = convertBuffersToBase64(object[i], newAncestors);
    }
  } else if (object instanceof Object) {
    for (var j in object) {
      object[j] = convertBuffersToBase64(object[j], newAncestors);
    }
  }
  return object;
};

module.exports.stringify = function (object) {
  var base64Object = convertBuffersToBase64(object);
  return JSON.stringify(base64Object);
};

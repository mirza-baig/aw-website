export function isNullOrWhitespace(string) {
  if (typeof string === 'undefined' || string == null) {
    return true;
  }
  return string.replace(/\s/g, '').length < 1;
}

export function singleOrDefault(array, predicate) {
  let results = array;

  if (predicate !== undefined) {
    results = array.filter(predicate);
  }

  if (results.length === 0) {
    return null;
  } else if (results.length > 1) {
    throw new Error('More than one element satisfies the condition');
  } else {
    return results[0];
  }
}

export function firstOrDefault(array, predicate) {
  let results = array;

  if (predicate !== undefined) {
    results = array.filter(predicate);
  }

  if (results.length === 0) {
    return null;
  } else {
    return results[0];
  }
}

export function first(array, predicate) {
  let results = array;

  if (predicate !== undefined) {
    results = array.filter(predicate);
  }

  if (results.length === 0) {
    throw new Error('Array is empty');
  } else {
    return results[0];
  }
}

// Not sure if this is the best way to do this, but it works
export function decodeHtml(string) {
  let decodeTextArea = document.createElement('textarea');

  decodeTextArea.innerHTML = string;
  return decodeTextArea.value;
}

export function encodeUrl(string) {
  let parts = [];
  for (let i = 0; i < string.length; i++) {
    let ch = string.charAt(i);
    if (isUrlSafeChar(ch)) {
      parts.push(ch);
    } else if (ch === ' ') {
      parts.push('+');
    } else {
      parts.push(encodeURIComponent(ch));
    }
  }
  return parts.join('');
}

export function isUrlSafeChar(ch) {
  if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || (ch >= '0' && ch <= '9')) {
    return true;
  }

  switch (ch) {
    case '-':
    case '_':
    case '.':
    case '!':
    case '*':
    case '(':
    case ')':
      return true;
  }

  return false;
}

export function toFraction(value) {
  let parts = value?.split('.');

  if (!parts) {
    return undefined;
  }

  if (parts.length === 1) {
    return parts[0];
  }

  switch (parts[1]) {
    case '0':
      return parts[0];
    case '0625':
      return parts[0] + ' 1/16';
    case '125':
      return parts[0] + ' 1/8';
    case '1875':
      return parts[0] + ' 3/16';
    case '25':
      return parts[0] + ' 1/4';
    case '3125':
      return parts[0] + ' 5/16';
    case '375':
      return parts[0] + ' 3/8';
    case '4375':
      return parts[0] + ' 7/16';
    case '5':
      return parts[0] + ' 1/2';
    case '5625':
      return parts[0] + ' 9/16';
    case '625':
      return parts[0] + ' 5/8';
    case '6875':
      return parts[0] + ' 11/16';
    case '75':
      return parts[0] + ' 3/4';
    case '8125':
      return parts[0] + ' 13/16';
    case '875':
      return parts[0] + ' 7/8';
    case '9375':
      return parts[0] + ' 15/16';
    default:
      return value;
  }
}

export function shortenUrl(url, abortSignal = new AbortController().signal) {
  return new Promise((resolve, reject) => {
    if (url && url.length > 0) {
      let encodedUrl = encodeURIComponent(url);
      let method = 'GET';
      fetch('https://tinyurl.com/api-create.php?url=' + encodedUrl, { method, abortSignal })
        .then(
          (response) => {
            response.text().then((value) => {
              resolve({ url, shortenedUrl: value });
            });
          },
          (reason) => {
            reject(reason);
          }
        )
        .catch((reason) => {
          reject({ url, reason: 'API Error', apiResponse: reason });
        });
    } else {
      reject({
        url,
        reason: 'Invalid URL',
      });
    }
  });
}

export function GetUrlParts(url) {
  let urlParsed = new URL(url, 'https://server');

  let pathRegex = new RegExp(
    /([^#\?\/]*)#\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-5][0-9a-fA-F]{3}-[089abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})(?:\/(\d+))?(?:\?(.*))?/g
  );
  let matches = pathRegex.exec(urlParsed?.hash) ?? [];

  return {
    pathName: urlParsed?.pathname,
    option: matches[2],
    attributeIndex: matches[3],
    query: urlParsed?.search?.replace('?', ''),
  };
}

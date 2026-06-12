export function shortenUrl(url, abortSignal = new AbortController().signal) {
  return new Promise((resolve, reject) => {
    if (url && url.length > 0) {
      const encodedUrl = encodeURIComponent(url);
      const method = 'GET';
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

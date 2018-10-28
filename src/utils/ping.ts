import request from "request";

export default function ping(url: string) {
  return new Promise((resolve, reject) => {
    request(url, function(err) {
      if (err) {
        return reject(err);
      }
      resolve(true);
    });
  });
}

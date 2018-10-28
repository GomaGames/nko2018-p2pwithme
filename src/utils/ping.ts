import request from "request";

export default function ping(url: string) {
  return new Promise((resolve, reject) => {
    request(url, function(err, request) {
      if (err || request.statusCode >= 400) {
        return reject(err || request.statusCode);
      }
      resolve(true);
    });
  });
}

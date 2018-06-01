const fs = require("fs");
const rp = require("request-promise");

const TOKEN_URI = "https://accounts.spotify.com/api/token";

let credentials = {
  id: "0d5b2b268c1241de958c8883f7d4340e",
  secret: "3a2f9ff80cb0486c88a21e0b39094616"
};

let getCredentialHeader = () => {
  return {
    Authorization:
      "Basic " +
      new Buffer.from(credentials.id + ":" + credentials.secret).toString(
        "base64"
      )
  };
};

let getToken = () => {
  return rp(opts).then(token => {
    return token.access_token;
  });
};

const opts = {
  method: "POST",
  uri: TOKEN_URI,
  form: { grant_type: "client_credentials" },
  headers: getCredentialHeader(),
  json: true
};

getToken().then(token => {
  rp({
    uri: "https://api.spotify.com/v1/users/vugk8qhstm54hhp6kz6o8ageo/playlists",
    headers: { Authorization: "Bearer " + token },
    json: true
  }).then(data => {
    let playlists = data.items;
    let document = `---
mixes: true;
---
`;
    let l = playlists.length;
    playlists.forEach((x, i) => {
      document += template(x, i, l);
    });
    fs.writeFile("./docs/mixes/README.md", document, err => {
      if (err) console.log(err);
      console.log("successfully built mixes!");
    });
  });
});

let template = (x, i, l) => `
<a href="${x.external_urls.spotify}">
    <div>
        <img src="${x.images[0].url}" alt="">
        <h3>${x.name}</h3>
        <p>Mix #${l - i}</p>
    </div>
</a>
`;

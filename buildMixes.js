const fs = require("fs");
const rp = require("request-promise");

const TOKEN_URI = "https://accounts.spotify.com/api/token";

let credentials = {
  id: "",
  secret: ""
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

    let arr = [];

    playlists.map(x => {
      arr.push({ name: x.name, cover: x.images[0].url, id: x.id });
    });

    let js = `
export default ${JSON.stringify(arr, null, 2)}
`;
    fs.writeFile("./docs/.vuepress/mixes.js", js, "utf-8", err => {
      if (err) console.log(err);
      console.log("successfully built mixes!");
    });
  });
});

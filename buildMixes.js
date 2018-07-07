const fs = require("fs");
const rp = require("request-promise");

const TOKEN_URI = "https://accounts.spotify.com/api/token";

let credentials = {
  id: "0d5b2b268c1241de958c8883f7d4340e",
  secret: "a4a126a9bbf54d98b5e5dc1446e9691c"
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
    console.log(playlists);
    let l = playlists.length;
    // console.log(playlists.map((x, i) => template(x, i, l)));

    let arr = [];

    playlists.map((x, i) => {
      arr.push({ name: x.name, cover: x.images[0].url, id: x.id })
    })

    let js = `
export default ${JSON.stringify(arr, null, 2)}
`

    console.log(arr)

    fs.writeFile("./docs/.vuepress/mixes.js", js, 'utf-8', err => {
      if (err) console.log(err);
      console.log("successfully built mixes!");
    });
  });
});

// let template = (x, i, l) => `
// <div data-embed="https://open.spotify.com/embed/user/1134435866/playlist/${x.id}">
//     <img src="${x.images[0].url}" alt="">
//     <h3>${x.name}</h3>
//     <p>Mix #${l - i}</p>
// </div>
// `;

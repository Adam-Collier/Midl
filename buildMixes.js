const fs = require("fs");
const rp = require("request-promise");

// const Spotify = require("node-spotify-api");

// var spotify = new Spotify({
//   id:
//   secret:
// });

// spotify
//   .request(
//     "https://api.spotify.com/v1/users/vugk8qhstm54hhp6kz6o8ageo/playlists"
//   )
//   .then(function(data) {
//     console.log(data);
//     console.log(data);
//     let playlists = data.items;
//     let document = `---
// mixes: true;
// ---
// `;
//     playlists.forEach((x, i) => {
//       document += template(x, i);
//     });

//     console.log(document);
//     fs.writeFile("./docs/mixes/README.md", document, err => {
//       if (err) console.log(err);

//       console.log("this has been saved");
//     });
//   })
//   .catch(function(err) {
//     console.error("Error occurred: " + err);
//   });

// let template = (x, i) => `
// <a href="${x.external_urls.spotify}">
//     <div>
//         <img src="${x.images[0].url}" alt="">
//         <h1>${x.name}</h1>
//         <h2>Mix #${i + 1}</h2>
//     </div>
// </a>
// `;

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
    let document = `---
mixes: true;
---
`;
    playlists.forEach((x, i) => {
      document += template(x, i);
    });
    fs.writeFile("./docs/mixes/README.md", document, err => {
      if (err) console.log(err);
    });
  });
});

let template = (x, i) => `
<a href="${x.external_urls.spotify}">
    <div>
        <img src="${x.images[0].url}" alt="">
        <h1>${x.name}</h1>
        <h2>Mix #${i + 1}</h2>
    </div>
</a>
`;

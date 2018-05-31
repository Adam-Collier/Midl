<template>
  <div class="page">
    <Content :custom="false"/>
    <div class="mixes">{{mixes}}</div>
    <div class="content edit-link" v-if="editLink">
      <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
      <OutboundLink/>
    </div>
    {{mixes}}
    <div class="content page-nav" v-if="prev || next">
      <p class="inner">
        <span v-if="prev" class="prev">
          ← <router-link v-if="prev" class="prev" :to="prev.path">
            {{ prev.title || prev.path }}
          </router-link>
        </span>
        <span v-if="next" class="next">
          <router-link v-if="next" :to="next.path">
            {{ next.title || next.path }}
          </router-link> →
        </span>
      </p>
    </div>
    <slot name="bottom"/>
  </div>
</template>

<script>
import OutboundLink from "./OutboundLink.vue";
import { resolvePage, normalize, outboundRE, endingSlashRE } from "./util";

export default {
  components: { OutboundLink },
  props: ["sidebarItems"],
  computed: {
    data() {
      return this.$page.frontmatter;
    },
    editLink() {
      const {
        repo,
        editLinks,
        docsDir = "",
        docsBranch = "master",
        docsRepo = repo
      } = this.$site.themeConfig;

      let path = normalize(this.$page.path);
      if (endingSlashRE.test(path)) {
        path += "README.md";
      } else {
        path += ".md";
      }

      if (docsRepo && editLinks) {
        const base = outboundRE.test(docsRepo)
          ? docsRepo
          : `https://github.com/${docsRepo}`;
        return (
          base.replace(endingSlashRE, "") +
          `/edit/${docsBranch}/` +
          docsDir.replace(endingSlashRE, "") +
          path
        );
      }
    },
    editLinkText() {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      );
    },
    mixes() {
      //   fetch("https://api.spotify.com/v1/users/1134435866/playlists", {
      //     headers: { Authorization: "Bearer " + accessToken }
      //   })
      //     .then(response => {
      //       return response.json();
      //     })
      //     .then(data => {
      //       console.log(data);
      //     });

      // Get the hash of the url

      const hash = window.location.hash
        .substring(1)
        .split("&")
        .reduce(function(initial, item) {
          if (item) {
            var parts = item.split("=");
            initial[parts[0]] = decodeURIComponent(parts[1]);
          }
          return initial;
        }, {});
      window.location.hash = "";

      // Set token
      //   let _token = hash.access_token;
      let _token =
        "BQAMokzpKRFFdN12XcqGqZeitl8-EAk1hdzN5fKC23sfLKzrHsWlc-gcABBLnR7qhkPTj-DEb4K9e8txmy7xzQnGHynBtfDiKlCcvtcmfP2gpBzVgR8wkOhTa521eHYGEchKWLdQ0oWMQoM24pE_duNwKbjw1CNP4tspWf8";

      console.log(_token);

      const authEndpoint = "https://accounts.spotify.com/authorize";

      // Replace with your app's client ID, redirect URI and desired scopes
      const clientId = "0d5b2b268c1241de958c8883f7d4340e";
      const redirectUri = "http://localhost:8080/Midl/mixes";
      const scopes = ["user-top-read"];

      // If there is no token, redirect to Spotify authorization
      if (!_token) {
        window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
          "%20"
        )}&response_type=token&show_dialog=true`;
      }
    }
  }
};

function resolvePrev(page, items) {
  return find(page, items, -1);
}

function resolveNext(page, items) {
  return find(page, items, 1);
}

function find(page, items, offset) {
  const res = [];
  items.forEach(item => {
    if (item.type === "group") {
      res.push(...(item.children || []));
    } else {
      res.push(item);
    }
  });
  for (let i = 0; i < res.length; i++) {
    const cur = res[i];
    if (cur.type === "page" && cur.path === page.path) {
      return res[i + offset];
    }
  }
}
</script>

<style lang="stylus">
@import './styles/config.styl'
</style>

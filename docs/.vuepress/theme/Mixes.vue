<template>
  <!-- <div class="page"> -->
    <div class="mixes">
      <h1>Mixes</h1>
      <!-- <Content :custom="false"/> -->
      <div v-if="playlists.length">
        <div v-for="playlist in playlists">
          <div @click="switchPlaylist">
            <img :src="playlist.cover" alt="">
            <h3>{{playlist.name}}</h3>
            <p>Mix #4</p>
          </div>
        </div>
      </div>
      <div class="content edit-link" v-if="editLink">
        <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
        <OutboundLink/>
      </div>
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
      <div class="playlist">
        <iframe src="https://open.spotify.com/embed/album/1yyCXBEu27Ia1Y3torWIwC" width="300" height="380" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
      </div>
    </div>
  <!-- </div> -->
</template>

<script>
import OutboundLink from "./OutboundLink.vue";
import { resolvePage, normalize, outboundRE, endingSlashRE } from "./util";

export default {
  components: { OutboundLink },
  props: ["sidebarItems"],
  methods: {
    switchPlaylist(event) {
      console.log("this has been clicked");
    }
  },
  computed: {
    data() {
      return this.$page.frontmatter;
    },
    playlists() {
      return this.$mixes;
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

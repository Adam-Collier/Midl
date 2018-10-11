<template>
  <div class="mixes">
    <h1><slot/></h1>
    <div v-if="playlists.length">
      <div v-for="(playlist, index) in playlists">
        <div :data-id="playlist.id" @click="switchPlaylist($event)">
          <img :src="playlist.cover" alt="">
          <h3>{{playlist.name}}</h3>
          <p>Mix #{{playlists.length - index}}</p>
        </div>
      </div>
    </div>
    <div class="playlist" :class="{show: showPlaylist}">
      <iframe ref="iframe" :src="`https://open.spotify.com/embed/user/1134435866/playlist/${playlist}`" height="200px" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    </div>
  </div>
</template>

<script>
import OutboundLink from "./OutboundLink.vue";
import { resolvePage, normalize, outboundRE, endingSlashRE } from "./util";

export default {
  components: { OutboundLink },
  props: ["sidebarItems"],
  data: function() {
    return {
      showPlaylist: "",
      playlist: ""
    };
  },
  methods: {
    switchPlaylist(event) {
      let playlistId = event.currentTarget.dataset.id;

      if (this.playlist == playlistId) return;
      if (this.showPlaylist === "") this.showPlaylist = true;

      this.showPlaylist = false;

      setTimeout(() => {
        this.playlist = playlistId;
      }, 400);

      let iframe = this.$refs.iframe;
      iframe.onload = () => {
        this.showPlaylist = true;
      };
    }
  },
  computed: {
    playlists() {
      return this.$mixes;
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

<style lang="stylus" scoped>
.playlist
  transition: all 400ms ease-in-out
  margin-bottom: 0
  position: fixed
  width: 600px
  left: 50%
  transform: translate(-50%, 0px)
  max-width: 960px
  bottom: -231px
  height: 231px

iframe
  height: 231px
  width: 100%

.show
  transform: translate(-50%, -251px)

.d.by.bz.c0
  overflow-y: scroll
</style>


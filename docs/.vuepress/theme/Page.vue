<template>
  <div class="page">
    <div v-if="data.heroImage" class="interview-hero">
      <div v-bind:style="{backgroundImage: `url(${$withBase(data.heroImage)})`}"></div>
      <!-- <img v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero"> -->
        <div>
          <transition-group name="intro" v-on:enter="enter" appear>
            <h1 key="1">{{data.title}}</h1>
            <h2 key="2">{{data.workplace}}</h2>
            <p key="3">{{data.description}}</p>
            <div key="4"></div>
          </transition-group>
        </div>
    </div>
    <Content :custom="false"/>
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
    prev() {
      const prev = this.$page.frontmatter.prev;
      if (prev === false) {
        return;
      } else if (prev) {
        return resolvePage(this.$site.pages, prev, this.$route.path);
      } else {
        return resolvePrev(this.$page, this.sidebarItems);
      }
    },
    next() {
      const next = this.$page.frontmatter.next;
      if (next === false) {
        return;
      } else if (next) {
        return resolvePage(this.$site.pages, next, this.$route.path);
      } else {
        return resolveNext(this.$page, this.sidebarItems);
      }
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
  },
  methods: {
    enter: function(el, done) {
      el.tagName === "DIV" ? el.classList.add("linePop") : null;
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

.page
  padding-bottom: 2rem

  a
    color: $linkColor

.edit-link.content
  padding-top: 0 !important

  a
    color: lighten($textColor, 25%)
    margin-right: 0.25rem

.page-nav.content
  padding-top: 1rem !important
  padding-bottom: 0 !important

  .inner
    min-height: 2rem
    margin-top: 0 !important
    border-top: 1px solid $borderColor
    padding-top: 1rem

  .next
    float: right

.interview-hero
  display: flex
  flex-wrap: wrap
  justify-content: center
  align-items: flex-start
  max-width: 1500px
  margin: 0 auto

  > div
    &:nth-of-type(1)
      height: 37.5rem
      flex: 4 1 350px
      background-size: cover
      background-position: center center

    &:nth-of-type(2)
      padding: 0 1rem 0 1rem
      margin: 2rem
      align-self: flex-end
      flex: 1 1 350px
      position: relative

      div
        position: absolute
        width: 2px
        left: 0
        top: 50%
        transform: translateY(-50%)
        background-color: $accentColor

.intro-enter-active
  &:nth-child(1)
    transition: all 500ms 800ms
    transition-property: opacity, transform

  &:nth-child(2)
    transition: all 500ms 800ms
    transition-property: opacity, transform

  &:nth-child(3)
    transition: all 500ms 1000ms
    transition-property: opacity, transform

.intro-enter
  &:not(:last-child)
    opacity: 0
    transform: translateX(-0.8rem)

.intro-enter-to
  &:not(:last-child)
    opacity: 1
    transform: translateX(0px)

.description-delay
  transition: all 500ms 1000ms

iframe
  width: 100%
  display: block
  margin: 0 auto
  border-radius: 5px
  margin: 4em 0 3.5em 0

span p
  color: lighten($textColor, 40%)

span h2, span h1
  margin: 0

.linePop
  animation: linePop 250ms 700ms ease-in-out forwards

@keyframes linePop
  0%
    height: 0%
    opacity: 0

  100%
    height: 100%
    opacity: 1
</style>

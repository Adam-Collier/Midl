<template>
  <div class="theme-container"
    :class="[pageClasses, theme]"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd">
    <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar"/>
    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>
    <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar">
      <slot name="sidebar-top" slot="top"/>
      <slot name="sidebar-bottom" slot="bottom"/>
    </Sidebar>
    <div class="custom-layout" v-if="$page.frontmatter.layout">
      <component :is="$page.frontmatter.layout"/>
    </div>
    <transition :name="transitionName" @after-leave="afterLeave">
      <template>
        <Home v-if="$page.frontmatter.home"/>
        <Interviews v-if="$page.frontmatter.interviews"/>
        <Mixes v-if="$page.frontmatter.mixes"/>
        <Page v-if :sidebar-items="sidebarItems">
          <slot name="page-top" slot="top"/>
          <slot name="page-bottom" slot="bottom"/>
        </Page>
      </template>
    </transition>
    <svg @click="changeTheme" class="switch-theme" width="100%" height="100%" viewBox="0 0 480 448" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:1.41421;"><path d="M172.597,48.286c17.925,-5.808 37.046,-8.946 56.895,-8.946c101.917,0 184.66,82.743 184.66,184.66c0,101.917 -82.743,184.66 -184.66,184.66c-92.016,0 -168.403,-67.448 -182.376,-155.559c20.394,15.728 45.946,25.087 73.667,25.087c66.662,0 120.783,-54.121 120.783,-120.783c0,-48.122 -28.203,-89.71 -68.969,-109.119Z" style="stroke-width:13px;stroke:#3eaf7c;"/></svg>
  </div>
</template>

<script>
import Vue from "vue";
import nprogress from "nprogress";
import Home from "./Home.vue";
import Navbar from "./Navbar.vue";
import Page from "./Page.vue";
import Interviews from "./Interviews.vue";
import Mixes from "./Mixes.vue";
import Sidebar from "./Sidebar.vue";
import { pathToComponentName } from "@app/util";
import { resolveSidebarItems } from "./util";

export default {
  components: { Home, Page, Sidebar, Navbar, Interviews, Mixes },
  data() {
    return {
      isSidebarOpen: false,
      transitionName: "",
      theme: ""
    };
  },

  watch: {
    $route(to, from) {
      console.log(to.path);
      const toPath = to.path;
      const fromPath = from.path;

      if (toPath.includes("interview") && fromPath == "/") {
        this.transitionName = "interview";
      } else if (fromPath == "/" && toPath.includes("mixes")) {
        this.transitionName = "home";
      } else if (fromPath.includes("mixes") && toPath == "/") {
        this.transitionName = "interview";
      } else if (fromPath.includes("interview") && toPath == "/") {
        this.transitionName = "home";
      } else if (fromPath.includes("interview") && toPath.includes("mixes")) {
        this.transitionName = "home";
      } else if (fromPath.includes("mixes") && toPath.includes("interview")) {
        this.transitionName = "interview";
      }

      // if (nextPath.includes("interview")) {
      //   this.transitionName = "interview";
      // } else if (nextPath.includes("mixes")) {
      //   this.transitionName = "mixes";
      // } else {
      //   this.transitionName = "home";
      // }
    }
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },
    shouldShowSidebar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      return (
        !frontmatter.layout &&
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },
    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$route,
        this.$site,
        this.$localePath
      );
    },
    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar
        },
        userPageClass
      ];
    }
  },

  created() {
    if (this.$ssrContext) {
      this.$ssrContext.title = this.$title;
      this.$ssrContext.lang = this.$lang;
      this.$ssrContext.description =
        this.$page.description || this.$description;
    }
    // update existing scrollBehavior in $rooter.options
    let scrollBehavior = (to, from, savedPosition) => {
      return new Promise(resolve => {
        // wait for triggerScroll to be emitted from javascript hook
        this.$root.$once("triggerScroll", () => {
          resolve({ x: 0, y: 0 });
        });
      });
    };
    this.$router.options.scrollBehavior = scrollBehavior;
  },

  mounted() {
    // update title / meta tags
    this.currentMetaTags = [];
    const updateMeta = () => {
      document.title = this.$title;
      document.documentElement.lang = this.$lang;
      const meta = [
        {
          name: "description",
          content: this.$description
        },
        ...(this.$page.frontmatter.meta || [])
      ];
      this.currentMetaTags = updateMetaTags(meta, this.currentMetaTags);
    };
    this.$watch("$page", updateMeta);
    updateMeta();

    // configure progress bar
    nprogress.configure({ showSpinner: false });

    this.$router.beforeEach((to, from, next) => {
      if (
        to.path !== from.path &&
        !Vue.component(pathToComponentName(to.path))
      ) {
        nprogress.start();
      }
      next();
    });

    this.$router.afterEach(() => {
      nprogress.done();
      this.isSidebarOpen = false;
    });
  },

  beforeDestroy() {
    updateMetaTags(null, this.currentMetaTags);
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    },
    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    },
    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
    // transition javascript hook
    afterLeave() {
      this.$root.$emit("triggerScroll");
    },
    changeTheme() {
      const isDark = this.theme.includes("dark");
      this.theme = isDark ? "" : "dark";
    }
  }
};

function updateMetaTags(meta, current) {
  if (current) {
    current.forEach(c => {
      document.head.removeChild(c);
    });
  }
  if (meta) {
    return meta.map(m => {
      const tag = document.createElement("meta");
      Object.keys(m).forEach(key => {
        tag.setAttribute(key, m[key]);
      });
      document.head.appendChild(tag);
      return tag;
    });
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="./styles/theme.styl" lang="stylus"></style>
<style lang="stylus">
.switch-theme
  fill: none
  position: fixed
  bottom: 20px
  right: 20px
  width: 30px
  height: 30px
  cursor: pointer

// transition variables
$transition = 10vw
$transitionSpeed = 400ms
$transitionDelay = 400ms

// transitions
.interview-enter-active
  transition: all $transitionSpeed $transitionDelay

.interview-leave-active
  transition: all $transitionSpeed ease-in

.interview-enter
  opacity: 0
  transform: translateX($transition)

.interview-enter-to, .interview-leave
  opacity: 1
  transform: translateX(0px)

.interview-leave-to
  opacity: 0
  transform: translateX(- $transition)

.home-enter-active
  transition: all $transitionSpeed $transitionDelay

.home-leave-active
  transition: all $transitionSpeed ease-in

.home-enter
  opacity: 0
  transform: translateX(- $transition)

.home-enter-to, .interview-leave
  opacity: 1
  transform: translateX(0px)

.home-leave-to
  opacity: 0
  transform: translateX($transition)

.mixes-enter-active
  transition: all $transitionSpeed $transitionDelay

.mixes-leave-active
  transition: all $transitionSpeed ease-in

.mixes-enter
  opacity: 0
  transform: translateX($transition)

.mixes-enter-to, .interview-leave
  opacity: 1
  transform: translateX(0px)

.mixes-leave-to
  opacity: 0
  transform: translateX(- $transition)
</style>


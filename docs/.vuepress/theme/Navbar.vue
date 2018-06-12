<template>
  <header class="navbar">
    <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>
    <router-link :to="$localePath" class="home-link">
      <img class="logo"
        v-if="$site.themeConfig.logo"
        :src="$withBase($site.themeConfig.logo)">
      <span class="site-name"
        v-if="$siteTitle"
        :class="{ 'can-hide': $site.themeConfig.logo }">
        {{ $siteTitle }}
        <!-- <svg height="18px" viewBox="0 0 370 134" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="padding-bottom:3px;vertical-align: middle;fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g><path d="M154.542,110.513l0,-84.52c0,-10.786 6.012,-15.561 13.615,-15.561l0,-3.006l-39.077,0l-35.365,89.649l-42.614,-89.649l-44.559,0l0,3.006c4.421,0.354 13.262,0.354 19.981,12.201l0,64.54c0,0 0,41.73 -26.523,41.73l0,3.006l53.577,0l0,-3.006c-20.727,0 -21.379,-39.166 -21.379,-39.166l0,-59.766l46.841,103.529l10.499,0l39.542,-110.27l0,87.283c0,12.024 -5.305,18.39 -12.732,18.39l0,3.006l53.4,0l0,-3.006c-7.603,0 -15.206,-6.366 -15.206,-18.39Z"/><path d="M208.296,22.456c0,-6.719 -5.482,-12.024 -12.201,-12.024c-6.719,0 -12.024,5.305 -12.024,12.024c0,6.72 5.305,12.024 12.024,12.024c6.719,0 12.201,-5.304 12.201,-12.024ZM208.826,110.337l0,-61.711l-30.944,7.073l0,3.006c7.25,3.89 9.018,6.365 9.018,12.377l0,39.255c0,9.017 -0.353,16.444 -7.073,18.566l0,3.006l36.249,0l0,-3.006c-6.366,-1.768 -7.25,-8.664 -7.25,-18.566Z"/><path d="M293.347,95.936c0,12.681 -5.128,26.378 -19.451,26.378c-14.322,0 -20.157,-14.075 -20.157,-34.08c0,-20.005 5.658,-31.605 18.566,-31.605c10.079,0 20.925,4.499 20.925,25.341l0.117,13.966ZM315.272,114.757l0,-114.757l-30.943,6.542l0,3.006c7.249,2.653 9.018,4.421 9.018,10.61l0,33.773c-5.659,-3.36 -13.085,-5.305 -21.219,-5.305c-24.755,0 -43.498,12.731 -43.498,41.199c0,27.938 17.682,43.675 37.663,43.675c8.311,0 21.395,-3.89 27.054,-14.322l0,10.962c0,0 0,3.891 4.951,3.183l25.992,-3.89l0,-3.006c-7.249,-0.884 -9.018,-3.006 -9.018,-11.67Z"/><path d="M361.953,110.513l0,-110.513l-30.943,6.542l0,3.006c7.072,2.653 8.841,5.305 8.841,11.494l0,89.471c0,9.018 -0.354,16.445 -7.073,18.39l0,3.006l36.248,0l0,-3.006c-6.189,-1.592 -7.073,-8.664 -7.073,-18.39Z"/></g></svg> -->
        <!-- <svg height="22px" viewBox="0 0 370 135" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" style="vertical-align:middle;fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:1.41421;"><g><path d="M139.909,25.6c-0.237,7.348 -0.356,14.725 -0.356,22.133l0,51.021c0,7.407 0.119,14.844 0.356,22.311l14.399,5.309l0,5.179l-55.465,0l0,-5.687l14.399,-4.801c0.238,-7.348 0.356,-14.726 0.356,-22.133c0,-7.408 0,-14.904 0,-22.489l0,-31.288l-39.821,86.398l-7.111,0l-40.178,-86.22l0,75.02l16.711,4.703l0,6.497l-43.199,0l0,-5.911l16.711,-5.289l0,-94.753l-9.405,-5.783l0,-4.706l30.382,0l40.177,83.554l39.111,-83.554l31.781,0l0,6.523l-8.848,3.966Z" style="fill:#000;fill-rule:nonzero;"/><path d="M187.73,28.266c-4.029,0 -7.496,-1.333 -10.4,-4c-2.903,-2.666 -4.355,-6.074 -4.355,-10.222c0,-4.148 1.452,-7.526 4.355,-10.133c2.904,-2.607 6.371,-3.911 10.4,-3.911c4.148,0 7.644,1.304 10.489,3.911c2.844,2.607 4.266,5.985 4.266,10.133c0,4.148 -1.422,7.556 -4.266,10.222c-2.845,2.667 -6.341,4 -10.489,4ZM210.485,123.731l0,7.822l-45.51,0l0,-7.822l10.844,-2.133c0.119,-4.504 0.178,-9.244 0.178,-14.222c0,-4.978 0,-9.363 0,-13.155l0,-8.889c0,-4.859 -0.059,-8.919 -0.178,-12.178c-0.118,-3.259 -0.237,-6.666 -0.355,-10.222l-11.911,-1.6l0,-6.755l37.155,-9.778l-0.534,25.422l0,37.244c0,5.037 0.06,9.748 0.178,14.133l10.133,2.133Z" style="fill:#000;fill-rule:nonzero;"/><path d="M279.817,62.577c-2.488,-1.778 -4.948,-3.2 -7.377,-4.267c-2.43,-1.067 -4.889,-1.6 -7.378,-1.6c-2.607,0 -5.096,0.652 -7.466,1.956c-2.371,1.303 -4.474,3.259 -6.311,5.866c-1.837,2.608 -3.319,5.896 -4.445,9.867c-1.126,3.97 -1.689,8.681 -1.689,14.133c0,10.785 1.808,18.785 5.422,23.999c3.615,5.215 8.089,7.822 13.422,7.822c2.608,0 5.245,-0.562 7.911,-1.688c2.667,-1.126 5.304,-2.578 7.911,-4.356l0,-51.732ZM314.306,123.731l0,7.822l-32.355,1.778l-1.423,-10.489c-3.555,3.674 -7.407,6.489 -11.555,8.445c-4.148,1.955 -8.948,2.933 -14.4,2.933c-4.977,0 -9.629,-0.948 -13.955,-2.844c-4.326,-1.897 -8.059,-4.741 -11.2,-8.534c-3.14,-3.792 -5.6,-8.503 -7.377,-14.133c-1.778,-5.629 -2.667,-12.177 -2.667,-19.644c0,-7.111 0.978,-13.511 2.933,-19.2c1.956,-5.688 4.652,-10.518 8.089,-14.488c3.437,-3.97 7.437,-7.022 12,-9.156c4.563,-2.133 9.511,-3.2 14.844,-3.2c4.978,0 9.363,0.83 13.155,2.489c3.793,1.66 7.23,4.03 10.311,7.111l0,-32.177l-10.255,-1.778l0,-4.048l31.766,-11.063l2.489,1.423l-0.711,25.244l0,91.376l10.311,2.133Z" style="fill:#000;fill-rule:nonzero;"/><path d="M369.416,123.731l0,7.822l-45.155,0l0,-7.822l10.667,-2.133c0.118,-4.622 0.207,-9.215 0.266,-13.778c0.059,-4.563 0.089,-9.096 0.089,-13.599l0,-73.777l-10.712,-1.778l0,-7.111l32.756,-8l2.489,1.423l-0.711,25.244l0,63.999c0,4.503 0.03,9.066 0.089,13.688c0.059,4.622 0.148,9.185 0.266,13.689l9.956,2.133Z" style="fill:#000;fill-rule:nonzero;"/></g></svg> -->
      </span>
    </router-link>
    <div class="links">
      <AlgoliaSearchBox v-if="isAlgoliaSearch" :options="algolia"/>
      <SearchBox v-else-if="$site.themeConfig.search !== false"/>
      <NavLinks class="can-hide"/>
    </div>
  </header>
</template>

<script>
import SidebarButton from './SidebarButton.vue';
import AlgoliaSearchBox from '@AlgoliaSearchBox';
import SearchBox from './SearchBox.vue';
import NavLinks from './NavLinks.vue';

export default {
  components: { SidebarButton, NavLinks, SearchBox, AlgoliaSearchBox },
  computed: {
    isAlgoliaSearch() {
      const algolia =
        this.$themeLocaleConfig.algolia || this.$site.themeConfig.algolia || {};
      return algolia && algolia.apiKey && algolia.indexName;
    }
  }
};
</script>

<style lang="stylus">
@import './styles/config.styl'

.navbar
  padding: 0.7rem 1.5rem
  line-height: $navbarHeight - 1.4rem
  position: relative

  a, span, img
    display: inline-block

  .logo
    height: $navbarHeight - 1.4rem
    min-width: $navbarHeight - 1.4rem
    margin-right: 0.8rem
    vertical-align: top

  .site-name
    font-size: 1.3rem
    font-weight: 600
    color: $textColor
    position: relative

  .links
    font-size: 0.9rem
    position: absolute
    right: 1.5rem
    top: 0.7rem

@media (max-width: $MQMobile)
  .navbar
    padding-left: 4rem

    .can-hide
      display: none
</style>

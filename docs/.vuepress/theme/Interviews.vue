<template>
  <div :class="{'interview-page': $route.path == '/interviews/'}">
    <h1><slot/></h1>
    <div class="interviews" v-if="articles.length">
      <div class="interview" v-for="(article, index) in articles"
      :class="{ first: index==0 && $page.frontmatter.interviews }">
        <router-link :to="article.path">
          <div>
            <img v-if="article.frontmatter.heroImage" :src="$withBase(article.frontmatter.heroImage)" alt="">
          </div>
          <h2>{{article.frontmatter.title}}</h2>
          <h3>{{article.frontmatter.workplace}}</h3>
          <p>{{article.frontmatter.description}}</p>
        </router-link>
      </div>
    </div>
    <Content custom/>
    <div class="footer" v-if="data.footer">
      {{ data.footer }}
    </div>
  </div>
</template>

<script>
import NavLink from "./NavLink.vue";

export default {
  components: { NavLink },
  computed: {
    data() {
      return this.$page.frontmatter;
    },
    articles() {
      return this.$interviews;
    }
  }
};
</script>

<template>
  <div class="interview-page">
    <div class="hero">
      <img v-if="data.heroImage" :src="$withBase(data.heroImage)" alt="hero">
      <p class="action" v-if="data.actionText && data.actionLink">
        <NavLink class="action-button" :item="actionLink"/>
      </p>
    </div>
    <div class="features" v-if="data.features && data.features.length">
      <div class="feature" v-for="feature in data.features">
        <h2>{{ feature.title }}</h2>
        <p>{{ feature.details }}</p>
      </div>
    </div>
    <h1>Interviews</h1>
    <div class="interviews" v-if="articles.length">
      <div class="interview" v-for="(article, index) in articles"
      v-bind:class="{ first: index==0 }">
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
      let interviews = this.$site.pages
        .filter(x => {
          console.log;
          return x.path.match(/(?=.*interviews)(?=.*html)/);
        })
        .sort((a, b) => {
          return (
            b.frontmatter.date
              .split(".")
              .reverse()
              .join("") -
            a.frontmatter.date
              .split(".")
              .reverse()
              .join("")
          );
        });
      console.log(interviews);
      interviews[0].first = true;
      return interviews;
    }
  }
};
</script>

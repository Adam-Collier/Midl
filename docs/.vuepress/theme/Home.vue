<template>
  <div class="home">
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
      <div class="interviews" v-if="articles.length">
        <div @click="interview($event, article.path)" class="interview" v-for="article in articles">
          <!-- <router-link :to="article.path"> -->
            <div>
              <img v-if="article.frontmatter.image" :src="$withBase(article.frontmatter.image)" alt="">
            </div>
            <div>
              <h2>{{article.frontmatter.title}}</h2>
              <p>{{article.frontmatter.description}}</p>
            </div>
          <!-- </router-link> -->
        </div>
      </div>
    </transition>
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
  data: function() {
    return {
      styleObject: {}
    };
  },
  methods: {
    interview: function(event, path) {
      event.preventDefault();
      console.log(event.currentTarget.parentElement.parentElement);
      let el = event.currentTarget;
      let pos = el.getBoundingClientRect();
      console.log(pos.left, pos.right);

      el.classList.add("transitioning");
      el.parentElement.parentElement.classList.add("expand");
      document.querySelectorAll(".interview").forEach(x => {
        if (x !== el) {
          x.classList.add("hide");
        }
      });

      let styleObject = {
        transform: `translateY(-${pos.top}px)`,
        transformOrigin: "center center",
        transition: "all 500ms ease-in"
      };

      Object.assign(el.style, styleObject);

      setTimeout(() => {
        this.$router.push(path);
      }, 800);
    }
  },
  computed: {
    data() {
      return this.$page.frontmatter;
    },
    actionLink() {
      return {
        link: this.data.actionLink,
        text: this.data.actionText
      };
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
      return interviews;
    }
  }
};
</script>

<style lang="stylus">
@import './styles/config.styl'

.home
  padding: $navbarHeight 2rem 0
  max-width: 960px
  margin: 0px auto

  .interviews
    display: grid
    grid-gap: 40px
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr))

  .interview
    img
      width: 100%

    h2, p
      margin-bottom: 0

    h2
      margin-top: 0.5em

    p
      font-size: 0.9rem
      margin-top: 0.6em

  .hide
    opacity: 0
    transition: all 500ms ease-in-out

  .transitioning
    display: flex
    flex-wrap: wrap
    justify-content: center
    align-items: flex-start
    max-width: 1500px
    margin: 0 auto
    padding: 3.6rem 0 0
    grid-column: 1 / -1
    transition: all 600ms ease-in-out

    div
      &:nth-child(1)
        height: 37.5rem
        flex: 5 1 350px

        img
          width: 100%
          height: 100%
          object-fit: cover

      &:nth-child(2)
        padding: 2rem
        align-self: flex-end
        flex: 1 1 350px
        opacity: 0

    &:before
      content: ''
      top: 0
      bottom: 0
      left: 0
      right: 0
      background: white

  .hero
    text-align: center

    img
      max-height: 280px
      display: block
      margin: 3rem auto 1.5rem

    h1
      font-size: 3rem

    h1, .description, .action
      margin: 1.8rem auto

    .description
      max-width: 35rem
      font-size: 1.6rem
      line-height: 1.3
      color: lighten($textColor, 40%)

    .action-button
      display: inline-block
      font-size: 1.2rem
      color: #fff
      background-color: $accentColor
      padding: 0.8rem 1.6rem
      border-radius: 4px
      transition: background-color 0.1s ease
      box-sizing: border-box
      border-bottom: 1px solid darken($accentColor, 10%)

      &:hover
        background-color: lighten($accentColor, 10%)

  .features
    border-top: 1px solid $borderColor
    padding: 1.2rem 0
    margin-top: 2.5rem
    display: flex
    flex-wrap: wrap
    align-items: flex-start
    align-content: strech
    justify-content: space-between

  .feature
    flex-grow: 1
    flex-basis: 30%
    max-width: 30%

    h2
      font-size: 1.4rem
      font-weight: 500
      border-bottom: none
      padding-bottom: 0
      color: lighten($textColor, 10%)

    p
      color: lighten($textColor, 25%)

  .footer
    padding: 2.5rem
    border-top: 1px solid $borderColor
    text-align: center
    color: lighten($textColor, 25%)

.expand
  max-width: none
  padding: 3.6rem 0 0

@media (max-width: $MQMobile)
  .home
    .features
      flex-direction: column

    .feature
      max-width: 100%
      padding: 0 2.5rem

@media (max-width: $MQMobileNarrow)
  .home
    padding-left: 1.5rem
    padding-right: 1.5rem

    .hero
      img
        max-height: 210px
        margin: 2rem auto 1.2rem

      h1
        font-size: 2rem

      h1, .description, .action
        margin: 1.2rem auto

      .description
        font-size: 1.2rem

      .action-button
        font-size: 1rem
        padding: 0.6rem 1.2rem

    .feature
      h2
        font-size: 1.25rem
</style>

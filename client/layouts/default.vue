<template>
  <div id="app" :style="bg">

    <toolbar v-if="showToolbar" />

    <section id="wrap">
      <nuxt />
    </section>

  </div>
</template>

<script>
import toolbar from '@/components/toolbar';

export default {
  components: {
    toolbar
  },
  computed: {
    showToolbar (){
      return this.$route.name !== 'login'
    },
    bg(){
      let background = 'default'
      if(this.$route.name === 'card-id' || this.$route.name === 'board-slug')
        background = this.$store.state.background;
      return { backgroundImage: `url(/uploads/board/${background})` }
    },
  }
}
</script>

<style>

#wrap {
    height: 100%;
    padding-top: 40px;
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0) 18%, rgba(0, 0, 0, 0) 81%, rgba(0, 0, 0, 0.52) 100%);
}

#app {
    background-position: center;
    background-size: cover;
    transition: background-image 0.2s ease-in-out;
}

@media(max-width: 600px) {
    #app {
        background-image: none !important
    }
}

.md-icon {
    margin-right: 15px
}

* {
    box-sizing: border-box;
}

html,
body,
#__nuxt,
#__layout,
#app {
    margin: 0;
    padding: 0;
    height: 100%;
}

html {
    font-size: 100%;
}

body {
    color: rgba(0, 0, 0, 0.87);
    background: #666 !important;
}

a {
    cursor: pointer;
    text-decoration: none;
}

a:hover,
a:focus {
  text-decoration: underline;
}

.sortable-ghost {
  box-shadow: inset 2px 2px 12px 0px rgba(0, 0, 0, .4);
}

.page-enter-active,
.page-leave-active {
  transition: opacity .1s
}

.page-enter,
.page-leave-active {
  opacity: 0
}

.mu-dialog {
  max-height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

button.float-button,
div.float-button {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 10;
  -webkit-backface-visibility: hidden;
}

@media(max-width: 700px) {
  .float-button {
      width: 40px;
      height: 40px;
  }
  .mu-dialog {
      width: 100%
  }
  .md-button.md-fab {
      height: 20px;
      width: 36px;
  }
}

.tags {
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  height: 5px;
  width: 100%;
  z-index: 3000
}

.tags > .mu-icon-button {
  width: 30px;
  height: 3px;
  display: block;
  margin-top: -18px;
  border-radius: 2px
}
</style>

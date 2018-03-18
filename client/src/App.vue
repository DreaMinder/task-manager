<template>
  <div id="app" :style="bg">

    <progress-bar v-show="isPreloading" />

    <toolbar v-if="showToolbar"></toolbar>

    <section id="wrap">
      <router-view></router-view>
    </section>

  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import progressBar from './ui/progress-bar';
import toolbar from './components/toolbar';

export default {
  name: 'app',
  components: {
    toolbar,
    progressBar
  },
  computed: {
    showToolbar (){
      return this.$route.name !== 'Login'
    },
    bg(){
      if(this.$store.getters.background)
        return { backgroundImage: `url(/uploads/board/${this.$store.getters.background})` }
    },
    ...mapGetters(['isPreloading','editable','error'])
  },
  created() {
    window.onbeforeunload = (e) => {
      if (this.editable)
        return this.$t('Are you sure?');
    };
  }
};
</script>

<style src="./style.css" lang="css"></style>

<style scoped>

  #wrap{
    height: 100%;
    padding-top: 40px;
    background: -webkit-linear-gradient(top,  rgba(0,0,0,0.52) 0%,rgba(0,0,0,0) 18%,rgba(0,0,0,0) 81%,rgba(0,0,0,0.52) 100%);
  }

  #app{
    background-position: center;
    background-size: cover;
    transition: background-image 0.2s ease-in-out;
  }

  @media(max-width: 600px){
    #app{
      background-image: none !important
    }
  }

  .md-icon{
    margin-right:15px
  }
</style>

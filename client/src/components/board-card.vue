<template>
  <div class="board-card">
    <md-card
      @click.self.native="goToBoard"
      :style="{backgroundImage: `url(/uploads/board/${board.image || 'default'})`}">

      <mu-icon-button
        v-if="board.userRole === 'admin'"
        icon="more_vert"
        :tooltip="$t('Settings')"
        tooltipPosition="bottom-left"
        @click.native="$emit('edit',board)" />

      <md-card-header @click.native="goToBoard">
        <div class="md-title">{{board.title}}</div>
        <div>{{board.descr}}</div>
      </md-card-header>

    </md-card>
  </div>
</template>

<script>

export default {
  name: 'boardCard',
  props: ['board'],
  methods: {
    goToBoard(){
      this.$router.push({
        name: 'Board',
        params: {
          slug: this.board.slug
        }
      });
    }
  }
};
</script>

<style scoped>
  .board-card{
    margin: 20px;
    min-width:300px;
    flex: 1 1 400px;
    background: #333;
  }
  .board-card:hover{
    cursor: pointer;
  }
  .board-card:hover .mu-icon-button{
    opacity: .8
  }
  .mu-icon-button{
    position: absolute;
    z-index:300;
    right: 0px;
    top:0px;
    color:#fff;
    opacity: 0
  }
  @media(max-width: 600px){
    .md-card{
      background-image: none !important
    }
  }
  .md-card-header {
    color: #fff;
    margin:0 !important;
    padding-top: 50px;
    background: -webkit-linear-gradient(top,  rgba(0,0,0,0) 0%,rgba(0,0,0,.5) 81% ,rgba(0,0,0,.5) 100%)
  }
  .md-card{
    display: flex;
    justify-content: flex-end;
    flex-direction: column;
    height:240px;
    background-color: #333 !important;
    border-radius: 0;
    background-position: center center;
    background-size: cover
  }
  @media(max-width: 600px){
    .md-card{
      height: 120px
    }
    .md-card-header{
      background: rgba(0, 0, 0, 0.5);
      height: 100%;
      padding-top:20px
    }
  }
</style>
<style>
  .board-card .mu-icon{
      font-size: 20px
    }
</style>

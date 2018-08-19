<template>
  <md-sidenav class="md-right md-fixed" ref="rightSidenav">
    <md-table-card>
      <md-toolbar>
        <h1 class="md-title">{{$t('Board trash')}}</h1>
      </md-toolbar>

      <md-table-alternate-header :md-selected-label="$t('selected')" v-if="cards.length">
        <md-button class="md-icon-button" @click="deleteCards">
          <md-icon>delete</md-icon>
          <md-tooltip>{{$t('Delete')}}</md-tooltip>
        </md-button>

        <md-button class="md-icon-button" @click="recoverCards">
          <md-icon>undo</md-icon>
          <md-tooltip>{{$t('Recover')}}</md-tooltip>
        </md-button>
      </md-table-alternate-header>

       <md-table @select="onSelect" v-if="cards.length">
          <md-table-body>
            <md-table-row
              v-for="card in cards"
              :key="card._id"
              :md-item="card"
              md-selection
            >
              <md-table-cell>{{ card.title }}</md-table-cell>
            </md-table-row>
          </md-table-body>
      </md-table>

    </md-table-card>
  </md-sidenav>
</template>

<script>
export default {
  name: 'board-trash',
  props: ['board-id'],
  data (){
   return {
      cards: [],
      selected: []
    }
  },
  methods: {
    toggle() {
      this.$refs.rightSidenav.open()
      this.load()
    },
    onSelect(selection){
      this.selected = selection.map(s => s._id)
    },
    async deleteCards(){
      if(confirm('Are you sure?')){
        await Promise.all(this.selected.map(s =>
          this.$store.dispatch('card/delete', s)
        ))
        this.load()
      }
    },
    async recoverCards(){
      this.$store.commit('board/ADD_GROUP',  {
        title: this.$t('Recovered cards'),
        id: 0,
        editable: false,
        cards: this.selected
      });

      await this.$store.dispatch('board/updateBoard',{
        _id: this.boardId,
        groups: this.groups
      });
      this.load()
    },
    async load() {
      try {
        let result = await this.$axios(`/boards/${this.boardId}/trash`);
        this.cards = result.data;
      } catch(error){
        this.$toast.error(error);
        console.error(error);
      }
    }
  },
  computed:{
    groups(){
      return this.$store.getters['board/board'].groups
    }
  }
};
</script>

<style scoped>
  .timeline{
    padding:30px 40px
  }
  .mu-infinite-scroll{
    margin-top:20px;
    height:50px
  }
  .md-table-card{
    box-shadow: none
  }
</style>

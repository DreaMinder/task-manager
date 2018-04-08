<template>
  <transition name="fade">
    <section id="board">

          <section class="tags">
            <mu-icon-button
              v-for="tag in tags"
              :key="tag._id"
              :class="{active: filterTag === tag._id}"
              :style="{backgroundColor: tag.color}"
              :tooltip_="$t('Filter: ')+ tag.title"
              @click="setFilter(tag._id)"
            />
          </section>

          <draggable
            class="draggable"
            ref="draggable"
            v-model="groups"
            :options="{disabled: !isAdmin, animation: 300}" >

              <group v-for="group in groups"
                    :cards="group.cards"
                    :title="group.title"
                    :key="group._id || group.id"
                    :_id="group._id"
                    :editable="group.editable"
                    :admin="isAdmin"
                    :boardId="board._id"
                    :filter="filterTag"
                    @move="moveCard"
                    @insertCard="openInsertForm"
                ></group>

          </draggable>
          <transition name="fade" v-if="movingStatus !== 'started'">
            <mu-float-button
              v-if="isAdmin"
              class="float-button"
              icon="add"
              :tooltip_="$t('New group')"
              @click="newGroup" />
          </transition>
          <transition name="fade" v-else>
            <trash
                  :selected="isTrash"
                  class="float-button"
            ></trash>
          </transition>

          <card-insert
            :open="openCardModal"
            :users="board.users"
            :board-slug="board.slug"
            @save="insertCard"
            @close="openCardModal = false"
          />

      </section>
  </transition>
</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
import group from '../components/group';
import trash from '../components/trash';
import cardInsert from '../popups/card-insert'

export default {
  name: 'board',
  components: {
    group,
    trash,
    draggable,
    cardInsert
  },
  methods: {
    moveCard(status) {
      this.movingStatus = status;
      if (status === 'ended')
        this.$store.dispatch('updateBoard', {
          _id: this.board._id,
          groups: this.board.groups
        })
    },
    openInsertForm(id) {
      this.openCardModal = true;
      this.insertToGroup = id;
    },
    async insertCard(selectCard) {
      await this.$store.dispatch('insertCard', {
        groupId: this.insertToGroup,
        boardId: this.board._id,
        cardId: selectCard
      });
      this.openCardModal = false;
      this.insertToGroup = '';
    },
    newGroup() {
      this.$store.dispatch('addGroup', {
        title: '',
        id: 0,
        editable: true
      });
    },
    handleScroll(){
      if(!this.scrolled && this.container.scrollTop > 2) this.$store.dispatch('startScroll');
      if(this.scrolled && this.container.scrollTop === 0) this.$store.dispatch('endScroll');
    },
    setFilter(tag){
      if(this.filterTag === tag)
        this.filterTag = null
      else
        this.filterTag = tag
    }
  },
  data() {
    return {
      cards: [],
      filterTag: null,
      openCardModal: false,
      container: null,
      insertToGroup: '',
      isTrash: false,
      movingStatus: 'ended',
    }
  },
  computed: {
    groups: {
      get() {
        return this.board.groups
      },
      set(groups) {
        this.board.groups = groups;
        this.$store.dispatch('updateBoard', {
          _id: this.board._id,
          groups: this.board.groups
        })
      }
    },
    tags(){
      let usedTags = [];
      if(this.board.groups && this.board.groups.length > 0){
        this.board.groups.forEach(g => {
          if(g.cards && g.cards.length > 0)
          g.cards.forEach(c => {
            if(c.tags && c.tags.length > 0)
            c.tags.forEach(t => {
              usedTags.push(t._id)
            })
          })
        })
        return this.board.tags.filter(t => usedTags.indexOf(t._id) > -1)
      }
    },
    ...mapGetters(['board', 'scrolled', 'isAdmin'])
  },
  created() {
    this.$store.dispatch('getBoard', this.$route.params.slug);
  },
  mounted(){
    this.container = this.$refs.draggable.$el;
    this.container.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    this.container.removeEventListener('scroll', this.handleScroll);
  }
}
</script>


<style scoped>

  #board{
    position: absolute;
    top:0;
    width:100%;
  }

  .draggable {
    padding:50px 30px 30px;
    color:#fff;
    overflow: auto;
    height: 100vh;
    width:100%;
    transition: all .3s;
    white-space:nowrap;
    -webkit-overflow-scrolling: touch;
  }

  @media (max-width: 800px){
    .draggable{
      padding:40px 10px 20px;
    }
  }

  @media (min-width: 2100px){
    .draggable{
      padding:70px 50px 30px;
    }
  }
  /*#board > draggable{
    padding:80px 30px 60px;
    color:#fff;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow:auto;
    transition: all .3s;
  }*/

  /*#board-users{
    color:white;
    position: fixed;
    bottom:40px;
    padding: 0 40px;
  }*/

  .tags > .mu-icon-button.active,
  .tags > .mu-icon-button:hover{
    margin-top:-10px
  }
</style>
<style>
  #board .board-header .mu-icon{
      color:#fff !important
  }

</style>

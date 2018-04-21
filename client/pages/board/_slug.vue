<template>
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
      />
    </draggable>

    <transition name="fade" v-if="movingStatus !== 'started'">
      <mu-float-button
        v-if="isAdmin"
        class="float-button"
        icon="add"
        :tooltip_="$t('New group')"
        @click="newGroup"
      />
    </transition>
    <transition name="fade" v-else>
      <trash
        :selected="isTrash"
        class="float-button"
      />
    </transition>

    <card-insert
      :open="openCardModal"
      :users="board.users"
      :board-slug="board.slug"
      @save="insertCard"
      @close="openCardModal = false"
    />

  </section>
</template>

<script>
import { mapGetters } from 'vuex';
import draggable from 'vuedraggable';
import group from '@/components/group';
import trash from '@/components/trash';
import cardInsert from '@/components/popups/card-insert'

export default {
  components: {
    group,
    trash,
    draggable,
    cardInsert
  },
  head(){
    return {
      title: this.board.title || '...'
    }
  },
  async fetch ({ error, store, params }) {
    await store.dispatch('board/getBoard', params.slug)
  },
  methods: {
    moveCard(status) {
      this.movingStatus = status;
      if (status === 'ended')
        this.$store.dispatch('board/update', {
          _id: this.board._id,
          groups: this.groups
        })
    },
    openInsertForm(id) {
      this.openCardModal = true;
      this.insertToGroup = id;
    },
    async insertCard(selectCard) {
      await this.$store.dispatch('board/insertCard', {
        groupId: this.insertToGroup,
        boardId: this.board._id,
        cardId: selectCard
      });
      this.openCardModal = false;
      this.insertToGroup = null;
    },
    newGroup() {
      this.$store.commit('board/ADD_GROUP', {
        title: '',
        id: 0,
        editable: true
      });
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
      isTrash: false,
      filterTag: null,
      insertToGroup: null,
      openCardModal: false,
      movingStatus: 'ended'
    }
  },
  computed: {
    groups: {
      get() {
        return this.board.groups
      },
      set(groups) {
        this.$store.commit('board/SET_GROUPS', groups);
        this.$store.dispatch('board/update', {
          _id: this.board._id,
          groups
        })
      }
    },
    tags(){
      let usedTags = [];
      if(this.groups){
        this.groups.forEach(g => {
          if(g.cards)
            g.cards.forEach(c => {
              if(c.tags)
                c.tags.forEach(t => {
                  usedTags.push(t._id)
                })
            })
        })
        return this.board.tags.filter(t => usedTags.indexOf(t._id) > -1)
      }
    },
    ...mapGetters({
      board: 'board/board',
      isAdmin: 'board/isAdmin'
    })
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
  #board > draggable{
    padding:80px 30px 60px;
    color:#fff;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow:auto;
    transition: all .3s;
  }

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

<template>
  <div class="group">
    <section class="group-header">
      <text-editable
        :placeholder="$t('Group name')"
        class="group-title"
        :editable="groupEditable"
        @makeEditable="(admin)? groupEditable = true : false"
        :value="groupTitle"
        :white="true"
        :inline="true"
        @save="save"
      />

      <mu-icon-menu v-if="admin" class="more-button" icon="more_vert">
        <mu-menu-item leftIcon="add" :title="$t('New card')" @click="newCard" />
        <mu-menu-item leftIcon="flip_to_front" :title="$t('Insert card')" @click="$emit('insertCard', _id)" />
        <mu-menu-item leftIcon="edit" :title="$t('Rename')" @click="groupEditable = true" />
        <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="remove" />
      </mu-icon-menu>
    </section>

    <draggable
      v-model="list"
      class="dragArea"
      :options="{group:'cards', disabled: !admin, animation: 300}"
      @start="move('started')"
      @end="move('ended')">
        <groupCard v-for="card in cards"
          v-if="!filter || !!card.tags.filter(t => t._id === filter).length"
          :title="card.title"
          :key="card._id || card.id"
          :_id="card._id"
          :editable="card.editable"
          :tables="card.tables && card.tables.length"
          :lists="card.lists && card.lists.length"
          :notes="card.notes && card.notes.length"
          :admin="admin"
          :disabled="card.disabled"
          :newCard="card.newCard"
          :users="card.users"
          :tags="card.tags"
          :isForeign="card.board != boardId"
          :groupId="_id"
          @newCard="newCard"
          @save="move('ended')"
          ref="card"
        />
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import groupCard from './group-card';
import textEditable from './ui/text-editable';

export default {
  name: 'group',
  props: ['_id', 'title', 'cards', 'boardId', 'admin', 'editable', 'filter'],
  components: {
    draggable,
    groupCard,
    textEditable
  },
  methods: {
    move(status) {
      this.$emit('move', status);
    },
    save({title}) {
      this.groupEditable = false;
      this.$store.dispatch('board/renameGroup', {
        title,
        _id: this._id
      });
    },
    remove() {
      if (confirm('Are you sure?'))
        this.$store.dispatch('board/deleteGroup', this._id);
    },
    newCard(positionId) {
      this.$store.dispatch('board/addCard', {
        groupId: this._id,
        boardId: this.boardId,
        positionId
      });
    }
  },
  computed: {
    list: {
      get() {
        return this.cards
      },
      set(cards) {
        this.$store.commit('board/SET_CARDS', {
          groupId: this._id,
          cards
        });
      }
    }
  },
  data() {
    return {
      groupTitle: this.title,
      groupEditable: this.editable,
    }
  }
};
</script>

<style scoped>
  .group{
    background: rgba(0,0,0,.4);
    padding: 5px 15px;
    margin:10px;
    min-width: 350px;
    max-width: 440px;
    width: 100%;
    display: inline-block;
    vertical-align: top;
    will-change: transform;
  }
  .group-title{
    color: #fff !important;
    width: 100%;
    flex:1;
    margin: 10px 0;
    font-size: 120%;
    overflow: hidden;
  }

  .group-header{
    display: flex;
    align-items: center;
    padding-bottom: 5px
  }

  .more-button{
    opacity: 0;
    transition: opacity ease .2s;
    margin-right: -10px
  }
  .group:hover .more-button{
    opacity: 1
  }
 .dragArea, .dragArea span{
    display: block;
    min-height: 40px
  }
  .mu-text-field{
    margin-top: 4px;
    margin-bottom: -4px;
    color: #fff
  }
  @media (max-width: 1000px){
    .group{
      max-width:350px
    }
  }
</style>

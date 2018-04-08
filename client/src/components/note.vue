<template>

<div class="note">
    <md-card>
        <md-card-header>
            <md-card-header-text>
                <avatar class="md-avatar" :user="note.user" />
                <div class="md-title">{{note.user.firstName}} {{note.user.lastName}}</div>
                <div class="md-subhead">{{note.date | moment('dddd, DD MMMM YYYY, HH:mm')}}</div>
            </md-card-header-text>
            <div class="note-ctrls" v-if="note.user._id === user || isAdmin">
              <mu-raised-button primary :label="$t('Save')" v-if="note.editable" @click.native="saveEditable" />
              <mu-icon-menu
                  v-else
                  icon="more_vert"
              >
                  <mu-menu-item leftIcon="reply" :title="$t('Reply')" @click="reply" />
                  <mu-menu-item leftIcon="edit" :title="$t('Edit')" @click="makeEditable" />
                  <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="deleteNote" />
              </mu-icon-menu>
            </div>
        </md-card-header>


        <md-card-content>
            <div v-if="note.editable">
                <quill-editor
                  v-focus
                  v-model="note.content"
                  :options="{ placeholder: $t('Enter text...') }"
                />
            </div>
            <div v-else v-html="note.content"></div>
        </md-card-content>
    </md-card>

    <comment
      v-for="comment in note.comments"
      :key="comment._id"
      :comment="comment"
      @updateComment="saveEditable"
      @delete="deleteComment" />

</div>

</template>

<script>
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import comment from './comment'
import avatar from '../ui/avatar'

export default {
  name: 'note',
  props: ['note', 'cardId', 'isAdmin', 'user'],
  components: {
    quillEditor,
    comment,
    avatar
  },
  methods: {
    deleteComment(id) {
      this.note.comments = this.note.comments.filter(c => c._id != id)
      this.saveEditable()
    },
    reply() {
      this.note.comments.push({
        content: '',
        editable: true
      });
      this.$store.dispatch('startEdit')
    },
    makeEditable() {
      this.note.editable = true;
      this.$forceUpdate();
      this.$store.dispatch('startEdit')
    },
    saveEditable() {
      this.note.editable = false;
      this.$forceUpdate();

      this.$store.dispatch('updateNote', {
        note: this.note,
        cardId: this.cardId
      });
    },
    deleteNote: function() {
      if (confirm('Are you sure?'))
        this.$store.dispatch('deleteNote', this.note._id);
    },
  },
  directives: {
    focus:  {
      inserted: (el) => {
        el
        .firstElementChild
        .nextElementSibling
        .firstElementChild
        .focus()
      }
    }
  }
};
</script>


<style>
  .note p {
      margin-top: 0;
      margin-bottom: 5px;
  }
</style>

<style scoped>
  .note {
      margin: 20px;
  }
</style>

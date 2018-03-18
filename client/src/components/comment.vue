<template>
  <div class="comment">

<md-card>
  <md-card-header>
    <md-card-header-text v-if="comment.user">
      <avatar  class="md-avatar" :user="comment.user" />
      <div class="md-title">{{comment.user.firstName}} {{comment.user.lastName}}</div>
      <div class="md-subhead">{{comment.date | moment('DD MMMM, HH:mm')}}</div>
    </md-card-header-text>
    <mu-raised-button primary :label="$t('Save')" v-if="comment.editable" @click.native="saveEditable" />
    <mu-icon-menu
          v-else
          icon="more_vert"
    >
          <mu-menu-item leftIcon="edit" :title="$t('Edit')" @click="makeEditable" />
          <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="deleteComment" />
    </mu-icon-menu>

  </md-card-header>

  <md-card-content >
    <div v-if="comment.editable">
       <quill-editor
        v-focus
        v-model="comment.content"
        :options="{ placeholder: $t('Enter text...') }"
       />
    </div>
    <div v-else v-html="comment.content"></div>
  </md-card-content>
</md-card>

  </div>

</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import avatar from '../ui/avatar'

export default {
  name: 'comment',
  props: ['comment'],
  components: {
    quillEditor,
    avatar
  },
    methods: {
        makeEditable() {
            this.comment.editable = true;
            this.$forceUpdate();
            this.$store.dispatch('startEdit')
        },
        saveEditable() {
            this.comment.editable = false;
            this.$forceUpdate();
            this.$emit('updateComment');
        },
        deleteComment: function() {
            if (confirm('Are you sure?'))
               this.$emit('delete', this.comment._id);
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


<style scoped>
	.comment .md-card{
    background: #f9f9f9
	}
  .md-card-content{
    white-space:pre-line;
  }
</style>

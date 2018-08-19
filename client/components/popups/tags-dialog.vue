<template>
  <mu-dialog :open="open" :title="$t('Tags')" @close="$emit('close')">
    <div v-if="tags && chosenTags">
      <h5 style="margin-top:0">{{$t('Card tags')}}:</h5>
      <section class="tagsList">
        <draggable
          v-model="chosenTags"
          style="min-height:20px"
          :options="{group: { name:'tags', pull:false, put:true }}"
        >
          <mu-chip
            v-for="tag in populatedChosenTags"
            :key="tag._id"
            @delete="handleDelete(tag)"
            :style="{backgroundColor: tag.color}"
            showDelete
          >
            {{tag.title}}
          </mu-chip>
        </draggable>
      </section>
      <h5>{{$t('Board tags')}}:</h5>
    </div>
    <section class="tagsList" v-if="tags">
      <draggable
        v-model="tags"
        :options="{
        group: { name:'tags',  pull:'clone', put:false },
        disabled: !chosenTags,
        animation: 300}"
        @end="move"
      >
        <mu-chip
          v-for="tag in tags"
          :key="tag._id"
          @delete="handleDelete(tag)"
          :style="{backgroundColor: tag.color}"
          :showDelete="!chosenTags"
        >
          {{tag.title}}
        </mu-chip>
      </draggable>
    </section>

    <div v-if="!newTag" class="btn-group">
      <mu-raised-button
        :disabled="noChanges"
        slot="actions"
        @click="save"
        primary
        :label="$t('Save')"
      />
      <mu-flat-button
        slot="actions"
        primary
        @click="$emit('close')"
        :label="$t('Close')"
      />
      <div class="action-btn">
        <mu-flat-button
          @click="newTag = true"
          icon="add"
          :label="$t('Add new tag')"
        />
      </div>
    </div>
    <form v-else>
      <md-layout md-gutter>
        <md-layout
          md-flex-xsmall="100"
          :md-flex-medium="80"
          :md-flex-large="80"
        >
          <mu-text-field
            :label="$t('Name')"
            :hintText="$t('Tag name')"
            v-model="title"
            fullWidth
          />
        </md-layout>
        <md-layout md-flex-xsmall="100" >
          <mu-select-field
            v-model="color"
            :label="$t('Color')"
            fullWidth
            :style="{borderTopColor: color}"
          >
            <mu-menu-item
              v-for="color in colors"
              :key="color"
              :value="color"
              title=" "
              :style="{backgroundColor: color}"
            />
          </mu-select-field>
        </md-layout>
      </md-layout>

      <br>
      <mu-raised-button
        :disabled="!title"
        slot="actions"
        @click.native="addTag"
        primary
        :label="$t('Add new tag')"
      />
      <mu-flat-button
        slot="actions"
        primary
        @click="newTag = false"
        :label="$t('Cancel')"
      />
    </form>
  </mu-dialog>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'tags-dialog',
  components:{
    draggable
  },
  props: ['open','tags','card-tags','board-id','card-id'],
  data (){
    return {
      newTag: false,
      noChanges: true,
      colors: ['#d82c24','#1f6cdf','#ff9b00','#4f8a2a','#9b9b9b'],
      title: null,
      color: '#999',
      chosenTags: this.cardTags
    }
  },
  computed: {
    populatedChosenTags(){
      return this.chosenTags.filter(tag => {
        return this.tags.find(t => t._id === tag._id)
      }).map(tag => {
        return this.tags.find(t => t._id === tag._id)
      })
    }
  },
  methods: {
    move(e){
      let found = false;
      this.chosenTags.forEach((c,i) => {
        if(this.chosenTags[e.newIndex]._id === c._id)
            if(!found) found = true;
            else this.chosenTags.splice(i,1);
      })
      this.noChanges = false
    },
    handleDelete (tag){
      this.noChanges = false;
      let tags = this.tags;
      if(this.cardId) tags = this.chosenTags;
      let index = tags.findIndex(t => t._id === tag._id)
      tags.splice(index,1)
    },
    addTag(){
      let tags = JSON.parse(JSON.stringify(this.tags))
      tags.push({
        title: this.title,
        color: this.color
      })
      this.$store.dispatch('board/updateBoard',{
        _id: this.boardId || this.$store.getters.card.board._id,
        tags
      }).then(()=>{
        this.newTag = false
        this.title = null
        this.color = '#999'

        if(this.cardId)
          this.$store.dispatch('card/get',this.cardId);
      })
    },
    save(){
      let callback = () => {
        this.newTag = false
        this.noChanges = true
      };

      if(this.cardId)
        this.$store.dispatch('card/update',{
          _id: this.cardId,
          tags: this.chosenTags
        }).then(callback)
      else
        this.$store.dispatch('board/updateBoard',{
          _id: this.boardId,
          tags: this.tags
        }).then(callback)
    }
  },
  watch: {
    open() {
      this.newTag = false;
      this.chosenTags = this.cardTags
    }
  }
};
</script>

<style scoped>
  .mu-chip{
    margin: 0 5px 10px;
    color:#fff;
    font-size: 13px
  }
  .mu-chip:hover{
    cursor: grab;
  }
  .btn-group{
    padding:15px 0 0;
    display: flex
  }
  .action-btn{
    flex:1;
    text-align: right
  }
  .tagsList{
    margin: 0 0 15px
  }
  .mu-select-field{
    margin-top:-3px;
    border-top: 3px solid #fff
  }
</style>

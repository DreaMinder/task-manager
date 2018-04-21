<template>
  <div class="group-card" @contextmenu.prevent="cardEditable = !!admin">
    <md-card md-with-hover :class="{disabled}">
      <section class="card-tags">
        <div v-if="isForeign" :style="{'background-color': '#333'}">
          <md-tooltip>{{$t('Duplicated card')}}</md-tooltip>
        </div>
        <div v-else v-for="tag in cardTags" :style="{'background-color':tag.color}">
          <md-tooltip>{{tag.title}}</md-tooltip>
        </div>
      </section>

      <md-card-content @click.native="goToCard">
        <text-editable
          :placeholder="$t('Card name')"
          class="card-title"
          :value="title"
          :inline="true"
          :editable="cardEditable"
          @save="save"
        />
      </md-card-content>

      <md-card-actions class="group-actions" v-if="!cardEditable">

        <mu-flat-button icon="more_vert" @click="cardEditable = true" class="edit-card" v-if="admin && !disabled">
          <md-tooltip>{{$t('Rename')}}</md-tooltip>
        </mu-flat-button>

        <mu-flat-button icon="add" @click="$emit('newCard', _id)" class="edit-card" v-if="admin">
          <md-tooltip>{{$t('New card')}}</md-tooltip>
        </mu-flat-button>

        <avatar
          v-for="user in users"
          v-if="user.user != null && user.role === 'admin'"
          :key="user._id"
          :user="user.user"
          :tooltip="true"
        />

        <div class="space" @click="goToCard" />

        <mu-flat-button :label="notes+''" icon="note" :to="'/card/'+_id+'#notes'" v-if="notes">
          <md-tooltip>{{$t('Notes')}}</md-tooltip>
        </mu-flat-button>

        <mu-flat-button :label="lists+''" icon="dashboard" :to="'/card/'+_id+'#lists'" v-if="lists">
          <md-tooltip>{{$t('ToDo lists')}}</md-tooltip>
        </mu-flat-button>

        <mu-flat-button :label="tables+''" icon="dns" :to="'/card/'+_id+'#tables'" v-if="tables">
          <md-tooltip>{{$t('Tables')}}</md-tooltip>
        </mu-flat-button>

      </md-card-actions>

      <md-card-actions v-else>
        <mu-flat-button class="card-ok" icon="check" :title="$t('save')" />
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
import textEditable from './ui/text-editable';
import avatar from './ui/avatar'

export default {
  name: 'group-card',
  props: ['title', '_id', 'admin', 'disabled', 'isForeign', 'editable', 'tables', 'lists', 'notes', 'tags', 'users', 'newCard', 'groupId'],
  components: {
    textEditable,
    avatar
  },
  data(){
    return {
      cardTitle: this.title || '',
      cardEditable: this.editable
    }
  },
  computed: {
    cardTags(){
      let boardTags = this.$store.getters['board/tags'];
      let handler = tag => boardTags.find(t => t._id === tag._id)

      return this.tags.filter(handler).map(handler)
    }
  },
  methods: {
    save({title}){
     this.cardEditable = false;

     if(!title || title === '') title = 'A card';

     this.$store.dispatch('card/update', {
        title,
        _id: this._id,
        groupId: this.groupId
     }).then(()=>{
       if(this.newCard) this.$emit('save')
     });
   },
   goToCard(){
   if(this.disabled)
     this.$toast.error('Forbidden');
   else if(!this.cardEditable)
     this.$router.push('/card/' +  this._id);
 }
}
};
</script>

<style scoped>
  .card-tags{
    display: flex;
    flex-wrap: wrap;
  }
  .card-tags div{
    height:5px;
    flex: 1 0 auto;
  }

  .group-card{
    margin-bottom:15px;
    transition: all .3s;
    will-change: transform;
    color:#333
  }

  a{
    color:#333 !important;
  }
  .group-card a:hover{
    text-decoration: none !important
  }

  .disabled{
    background: #d8d7d7
  }
  .disabled:hover{
    cursor: default
  }
  .md-card{
    transition: all .3s;
    min-height: 60px;
  }
  .card-title{
    width: 100%;
    white-space: pre-line;
    line-height: 20px;
    font-size: 14px;
    margin: 0;
  }
  .card-title.focus-state{
    margin-top: -10px;
  }
  .space{
    flex: 1 0 auto;
    height: 28px
  }
  .group-actions{
    padding: 5px;
    opacity: .7;
    transition: opacity .2s ease
  }
  .md-card:hover .group-actions{
    opacity: .9
  }
  .md-card-content{
    padding-bottom: 0
  }
  .edit-card{
    align-self: flex-start;
    width: 0px;
    min-width: 5px !important;
    opacity: 0
  }
  .md-card:hover .edit-card{
    opacity: .9;
    width: 32px;
  }
  .card-ok{
    margin-top: -20px
  }
  @media(max-height: 600px){
    .md-card-actions{
      display: none
    }
  }
</style>
<style>
  .group-card .avatar,.group-card .fallback{
    min-height: 20px !important;
    min-width: 20px !important;
    height: 20px !important;
    width: 20px !important;
    font-size: 9px;
    padding: 0px;
    margin-left: 2px;
    line-height: 19px
  }
  .group-actions .mu-icon{
    font-size:120%;
    margin:0 0 0 5px
  }
  .group-actions .mu-flat-button-label{
    margin:0 5px 0 0;
    padding: 0 0 0 5px !important;
    font-size: 90%
  }
  .group-actions .mu-flat-button{
    min-width: 10px;
    height: 28px;
    line-height: 28px
  }
</style>

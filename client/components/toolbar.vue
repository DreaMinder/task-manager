<template>
  <div id="toolbar">
    <div id="nav" :class="{scrolled}">
      <mu-icon-button @click="$refs.sidebar.toggle()" icon="menu"/>

      <div class="breadcrumbs">
        <mu-flat-button
          v-if="leaf != $t('Boards')"
          :label="$t('Boards')"
          class="md-button"
          labelPosition="before"
          icon="keyboard_arrow_right"
          to="/"
        />
        <mu-flat-button
          v-if="parent"
          :label="parent.label"
          class="md-button parent"
          labelPosition="before"
          icon="keyboard_arrow_right"
          :to="parent.link"
        />
        <div class="leaf" v-if="leaf">
          {{leaf}}
        </div>
      </div>

      <div class="board-header" v-if="isBoard || isCard">
        <mu-icon-button
          v-if="isBoard && isAdmin"
          @click="$refs.boardTrash.toggle()"
          :tooltip_="$t('Board trash')"
          icon="delete"
        />
        <mu-icon-button
          @click="openUsers = true"
          :tooltip_="(isCard)? $t('Card members') : $t('Board members')"
          icon="group"
        />
        <mu-icon-button
          @click="openTags = true"
          v-if="(isCard)? isCardAdmin : isAdmin"
          :tooltip_="(isCard)? $t('Card tags') : $t('Board tags')"
          icon="class"
        />
      </div>

      <mu-icon-button
        v-if="isCard"
        @click="$refs.cardEvents.toggle()"
        icon="notifications"
        :tooltip_="$t('Card events')"
      />
    </div>

    <card-events
      :card-id="isCard && card._id"
      ref="cardEvents"
    />

    <board-trash
      :board-id="isBoard && board._id"
      ref="boardTrash"
    />

    <md-sidenav class="md-left md-fixed" ref="sidebar">
      <md-toolbar>
        <div class="md-toolbar-container">
          <h2 class="md-title">Task Manager</h2>
        </div>
      </md-toolbar>

      <mu-list>
        <div class="user-block">
          <avatar :user="user" v-if="user"></avatar>
          <p class="mu-item-title" v-if="user">{{ user.firstName }} {{ user.lastName }}</p>
        </div>
        <mu-divider />
        <mu-list-item :title="$t('Settings')" @click="toSettings">
          <mu-icon slot="left" value="settings"/>
        </mu-list-item>
        <!-- <mu-list-item :title="$t('Invite')" @click="openInvite = true">
          <mu-icon slot="left" value="share"/>
        </mu-list-item> -->
        <mu-list-item :title="$t('Logout')" @click="logOut">
          <mu-icon slot="left" value="exit_to_app"/>
        </mu-list-item>
      </mu-list>

      <div class="feedback-popover" >
        {{$t('footer')}}
        <br>
        <a href="mail:dreaminder7@gmail.com">dreaminder7@gmail.com</a>
      </div>

      <div class="feedback-popover">{{$t('Version')}} {{version}}</div>
    </md-sidenav>

    <users-dialog
      v-if="(isCard)? !!card.users : !!board.users"
      :open="openUsers"
      :users="(isCard)? card.users : board.users"
      :board-users="isCard && card.board.users"
      :card-id="isCard && card._id"
      :is-admin="(isCard)? isCardAdmin : isAdmin"
      :board-id="isBoard && board._id"
      @close="openUsers = false"
    />
    <tags-dialog
      v-if="(isCard)? !!card.tags : !!board.tags"
      :open="openTags"
      :tags="(isCard)? card.board.tags : board.tags"
      :card-tags="isCard && card.tags"
      :card-id="isCard && card._id"
      :board-id="isBoard && board._id"
      @close="openTags = false"
    />
    <invite-dialog
      :open="openInvite"
      @close="openInvite = false"
    />

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import avatar from './ui/avatar'
import inviteDialog from './popups/invite-dialog'
import usersDialog from './popups/users-dialog'
import tagsDialog from './popups/tags-dialog'
import cardEvents from './popups/card-events'
import boardTrash from './popups/board-trash'
const version = require('../package.json').version

export default {
  name: 'toolbar',
  components: {
    inviteDialog,
    usersDialog,
    tagsDialog,
    cardEvents,
    boardTrash,
    avatar
  },
  data (){
    return {
      openInvite: false,
      openUsers: false,
      openTags: false,
      version
    }
  },
  methods:{
    toSettings(){
      this.$router.push('/settings');
      this.$refs.sidebar.toggle()
    },
    logOut(){
      this.$auth.logout()
      this.$refs.sidebar.toggle()
	  this.$router.push('/login')
    }
  },
  computed: {
    isBoard(){
      return this.$route.name === 'board-slug'
    },
    isCard(){
      return this.$route.name === 'card-id'
    },
    leaf(){
      if(this.isBoard)
        return this.board.title
      if(this.isCard)
        return this.card.title
      if(this.$route.meta.title) //TODO
        return this.$route.meta.title[this.locale()]
      return false
    },
    parent(){
      if(this.isCard){
        if(this.board.title)
          var board = this.board;
        else
          var board = this.card.board
        return {
          label: board && board.title,
          link: '/board/' + (board && board.slug)
        }
      }
      return false
    },
    user(){
      return this.$store.state.auth.user
    },
    ...mapGetters({
      scrolled:'scrolled',
      events: 'card/events',
      board: 'board/board',
      card: 'card/card',
      isAdmin: 'board/isAdmin',
      isCardAdmin: 'card/isAdmin'
    })
  },
};
</script>

<style scoped>
  #nav{
    position: absolute;
    top:0;
    width: 100%;
    min-width: 420px;
    padding-right: 20px;
    display: flex;
    z-index: 100;
    background: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.52) 0%, rgba(0, 0, 0, 0) 100%);
    -webkit-backface-visibility: hidden;
    -webkit-transform: translate3d(0, 0, 0);
  }

  .breadcrumbs{
    flex:1;
    color:#fff;
    overflow: hidden;
    height:50px
  }
  .breadcrumbs a{
    color:#fff;
    text-transform: none;
    font-weight: normal;
  }
  .md-button{
    padding-left: 0;
    padding-right: 0;
    margin: 6px 0
  }
  .mu-icon-button:hover{
    background: rgba(0, 0, 0, .2);
  }

  .leaf{
    display: inline-block;
    padding: 14px 15px;
    max-width: 300px;
    height: 32px;
    overflow: hidden;
  }

  .feedback-popover {
    padding: 16px;
    color:#666;
    line-height: 20px;
    font-size:82%;
    margin-top: 30px;
    border: 1px solid #ebebeb;
  }

  .user-block{
    display: flex;
    height: 52px
  }
  .user-block{
    flex:1
  }
  .avatar{
    margin: 5px 20px 0 10px;
  }

  .board-header{
    max-height: 40px;
    box-sizing: border-box;
  }
</style>
<style>
  #nav .mu-icon{
    color:#fff !important
  }
  .parent .mu-flat-button-label{
    padding-left: 8px
  }
</style>

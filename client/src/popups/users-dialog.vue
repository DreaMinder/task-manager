<template>
  <mu-dialog
    :open="open"
    :title="(cardId)? $t('Card members') : $t('Board members')"
    @close="$emit('close')"
  >
    <section class="users" v-if="users">
      <h5>{{$t('Administrators')}}: <small>({{$t('full access')}})</small></h5>
      <draggable
        v-model="adminUsers"
        :options="{disabled: !isAdmin, group: {name: 'users', pull: adminUsers.length > 1},animation: 300}"
        @change="changeRole(arguments[0],'admin')"
      >
        <mu-chip
          v-for="user in adminUsers"
          :key="user._id"
          @delete="handleDelete(user)"
          :showDelete="isAdmin && adminUsers.length > 1"
        >
          <avatar :user="user.user" class="md" />
          {{user.user.firstName}} {{user.user.lastName}}
        </mu-chip>
      </draggable>
      <h5>{{$t('Common members')}}: <small>({{$t('partial access')}})</small></h5>
      <small v-if="commonUsers.length === 0">
        {{$t('Drag members to another section to change their permissions')}}
      </small>
      <draggable
        v-model="commonUsers"
        style="min-height:20px"
        :options="{group: 'users', disabled: !isAdmin}"
        @change="changeRole(arguments[0],'common')"
      >
        <mu-chip
          v-for="user in commonUsers"
          :key="user._id"
          @delete="handleDelete(user)"
          :showDelete="isAdmin"
        >
          <avatar :user="user.user" class="md" :tooltip="compact" />
          <span v-if="!compact">{{user.user.firstName}} {{user.user.lastName}}</span>
        </mu-chip>
      </draggable>
      <div v-if="cardId">
        <h5>{{$t('Board members')}}: <small>({{$t('with no access')}})</small></h5>

        <draggable
          v-model="cardBoardUsers"
          style="min-height:20px"
          :options="{group: 'users', disabled: !isAdmin}"
        >
          <mu-chip
            v-for="user in cardBoardUsers"
            :key="user._id"
          >
            <avatar :user="user.user" class="md" :tooltip="compact" />
            <span v-if="!compact">{{user.user.firstName}} {{user.user.lastName}}</span>
          </mu-chip>
        </draggable>
      </div>
    </section>

    <div v-if="!newUser" class="btn-group">
      <mu-raised-button
        :disabled="noChanges"
        slot="actions"
        @click="save(null)"
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
          @click="setUsers"
          icon="add"
          v-if="isAdmin && !cardId"
          :label="$t('Add new member')"
        />
        <mu-flat-button
          @click="leave"
          icon="clear"
          v-if="!isAdmin"
          :label="$t((cardId)? 'Leave card' : 'Leave board')"
        />
      </div>
    </div>
    <form v-else>
      <mu-auto-complete
        :hintText="$t('user-hint')"
        :label="$t('Name of a new member')"
        fullWidth
        openOnFocus
        :maxHeight="300"
        filter="noFilter"
        :dataSourceConfig="{text: 'name', value: '_id'}"
        @input="handleInput"
        @select="handleChange"
        :dataSource="userList"
      />
      <br />
      <br />
      <mu-raised-button
        :disabled="!selectedUser"
        slot="actions"
        @click.native="addUser"
        primary
        :label="$t('Add user to board')"
      />
      <mu-flat-button
        slot="actions"
        primary
        @click="newUser = false"
        :label="$t('Cancel')"
      />
    </form>
  </mu-dialog>
</template>

<script>
import axios from 'axios';
import avatar from '../ui/avatar'
import draggable from 'vuedraggable';

export default {
  name: 'users-dialog',
  props: ['open','users','isAdmin','board-users','board-id','card-id'],
  components: {
    avatar,
    draggable
  },
  data (){
    return {
      newUser: false,
      noChanges: true,
      fetchedUsers: [],
      selectedUser: null
    }
  },
  computed: {
    adminUsers: {
      get(){
        return this.users.filter(u => u.role === 'admin')
      }, set(){}
    },
    commonUsers: {
      get(){
        return this.users.filter(u => u.role !== 'admin')
      }, set(){}
    },
    cardBoardUsers: {
      get(){
        return this.boardUsers.filter(user =>{
          return !this.users.find(u => u.user._id === user.user._id)
        })
      }, set(){}
    },
    userList(){
      return this.fetchedUsers.map(u => {
        return {
          _id: u._id,
          name: u.firstName + ' ' + u.lastName
        }
      })
    },
    compact(){
      return this.boardUsers.length > 20
    }
  },
  methods: {
    changeRole(e,role){

      if(e.added){
        let index = this.users.findIndex(u => u._id === e.added.element._id)
        if(index !== -1)
          this.users[index].role = role;
        else {
          let newUser = e.added.element;
          newUser.role = role;
          this.users.push(newUser)
        }
        this.noChanges = false
      }
    },
    setUsers(){
      this.newUser = true;
      this.fetchedUsers = []
    },
    handleChange (val) {
      this.selectedUser = val._id
    },
    async handleInput (query) {
      if (query.length === 0) {
        this.setUsers();
        return
      }
      this.$store.dispatch('startPreload')
      let result = await axios.get(global.baseURL + '/users?search='+query);
      this.fetchedUsers = result.data;
      this.$store.dispatch('endPreload')
    },
    handleDelete (user){
      this.noChanges = false;
      let index = this.users.findIndex(u => u._id === user._id)
      this.users.splice(index,1)
    },
    addUser(){
      let users = JSON.parse(JSON.stringify(this.users))
      let index = users.findIndex(u => u.user._id === this.selectedUser)
      if(index > -1) {
        this.$store.dispatch('handleError',new Error(this.$t('User already exists')))
        return
      }
      users.push({
         user: this.selectedUser,
         role: 'common'
       })
      this.save(users)
    },
    save(users){
      let callback = ()=>{
        if(!users) this.$emit('close')
        else this.newUser = false
        this.noChanges = true
      };

      if(this.cardId)
        this.$store.dispatch('updateCard',{
          _id: this.cardId,
          users: users || this.users
        }).then(callback)
      else
        this.$store.dispatch('updateBoard',{
          _id: this.boardId,
          users: users || this.users
        }).then(callback)
    },
    leave(){
      if (confirm(this.$t('Are you sure?')))
          this.$store.dispatch('leaveBoard', this.boardId).then(()=>{
            this.$emit('close')
            this.$router.push('/');
          });
    }
  },
  watch: {
    open: function() {
      this.newUser = false
    }
  }
};
</script>

<style scoped>
  .mu-chip{
    margin: 0 5px 5px;
  }
  .mu-chip:hover{
    cursor: grab;
  }
  .avatar{
     margin: 0 5px 0 -15px
  }
  .btn-group{
    padding:15px 0 15px 0;
    display: flex
  }
  .action-btn{
    flex:1;
    text-align: right
  }
  .users{
    margin: -15px 0 15px
  }
</style>

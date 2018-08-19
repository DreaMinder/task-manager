<template>
  <div class="table" v-if="tasks">
    <md-table-card>
      <md-toolbar>
        <text-editable
          :placeholder="$t('Table name')"
          class="md-title"
          :editable="tableData.editable"
          :inline="true"
          @makeEditable="isAdmin ? tableData.editable = true : false; $forceUpdate()"
          :value="tableData.title"
          @save="save"
        />
        <mu-icon-button
          icon="add"
          v-if="isAdmin"
          @click="newTask"
          :tooltip="$t('New task')"
        />
        <mu-text-field
           v-if="search && !draggable"
           :hintText="$t('Task name')"
           class="searchfield"
           v-model="query"
           @blur="(!query)? search = false : ''"
        />
        <mu-icon-button
            v-if="!draggable"
            icon="search"
            :class="{ active: search }"
            @click="search=!search; query = ''"
            :tooltip="$t('Search')"
         />
        <mu-icon-button
            v-if="!draggable"
            icon="check"
            :class="{ active: hideDone }"
            @click="hideDone = !hideDone"
            :tooltip="$t('Hide done')"
         />
         <mu-icon-button
            icon="sort"
            v-if="sort && !draggable"
            class="active"
            @click="onSort(false)"
            :tooltip="$t('Disable sorting')"
        />
        <mu-icon-button
            v-if="!draggable"
            icon="group"
            :class="{ active: grouped }"
            @click="grouped = !grouped"
            :tooltip="$t('Group by manager')"
        />
        <mu-icon-button
            icon="flip_to_back"
            v-if="isAdmin"
            :class="{ active: draggable }"
            @click="draggable = !draggable"
            :tooltip="$t('Reorder mode')"
        />
        <mu-icon-menu icon="more_vert" v-if="isAdmin">
           <mu-menu-item leftIcon="add" :title="$t('New task')" @click="newTask" />
           <mu-menu-item leftIcon="keyboard_arrow_up" :title="$t('Move up')" @click="reorder({up: true})" />
           <mu-menu-item leftIcon="keyboard_arrow_down" :title="$t('Move down')" @click="reorder({down: true})" />
           <mu-menu-item leftIcon="edit" :title="$t('Rename')" @click="tableData.editable = true; $forceUpdate()" />
           <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="deleteTable" />
        </mu-icon-menu>
      </md-toolbar>

      <md-table @sort="onSort">
        <md-table-header>
          <table-stats :tasks="tableData.tasks" />

          <md-table-row>
            <md-table-head width="280px">{{$t('Task')}}</md-table-head>
            <md-table-head
              md-sort-by="timeLast"
              width="50px"
              md-numeric
              :md-tooltip="$t('Working days for getting done')"
            >
              {{$t('Terms')}}
            </md-table-head>
            <md-table-head width="50px">{{$t('Status')}}</md-table-head>
            <md-table-head md-sort-by="start" width="110px">{{$t('Start')}}</md-table-head>
            <md-table-head md-sort-by="finish" width="110px">{{$t('End')}}</md-table-head>
            <md-table-head width="50px" v-if="!grouped">{{$t('Manager')}}</md-table-head>
            <md-table-head>{{$t('Executors')}}</md-table-head>
            <md-table-head>
              <md-icon>message</md-icon>
              <span>{{$t('Description')}}</span>
            </md-table-head>
            <md-table-head width="10px"></md-table-head>
          </md-table-row>
        </md-table-header>

        <draggable
          v-if="draggable"
          element="md-table-body"
          :options="{scrollSensitivity: 100, animation: 300}"
          @sort="move"
        >
          <table-row
            v-for="task in tableData.tasks"
            :key="task._id"
            :statuses="statuses"
            :task="task"
            :isAdmin="isAdmin"
            :tableId="tableData._id"
            @edit="editTask"
            @delete="deleteTask"
          />
        </draggable>

        <md-table-body
          v-else
          v-for="(group, groupIndex) in tasks"
          :key="groupIndex"
        >
          <md-table-row v-if="grouped">
            <md-table-cell colspan="9">
              <h4 class="groupName">{{groupIndex}}</h4>
            </md-table-cell>
          </md-table-row>

          <table-row
            v-for="task in group"
            v-if="isVisible(task)"
            :key="task._id"
            :task="task"
            :isAdmin="isAdmin"
            :grouped="grouped"
            :statuses="statuses"
            :tableId="tableData._id"
            @dblclick.native="editTask(task)"
            @edit="editTask"
            @delete="deleteTask"
          />
        </md-table-body>
      </md-table>
    </md-table-card>

    <mu-dialog :open="openModal" @close="openModal = false">
      <form>
        <md-layout md-gutter>
          <md-layout
            md-flex-xsmall="100"
            :md-flex-medium="titleWidth(task.title)"
            :md-flex-large="titleWidth(task.title)"
            :md-flex-xlarge="titleWidth(task.title)"
          >
            <mu-text-field
              :label="$t('Task name')"
              labelFloat
              fullWidth
              v-model="task.title"
            />
          </md-layout>
          <md-layout md-flex-xsmall="100">
            <mu-select-field
              v-model="task.status"
              :label="$t('Status')"
              fullWidth
              labelFloat
              @change="statusHandler"
            >
              <mu-menu-item
                v-for="status in statuses"
                :key="status.id"
                :value="status.value"
                :title="$t(status.value)"
              />
            </mu-select-field>
          </md-layout>
        </md-layout>

        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100">
            <date-picker :label="$t('Start date')" v-model="task.start" />
          </md-layout>
          <md-layout md-flex-xsmall="100">
            <date-picker :label="$t('End date')" v-model="task.finish" />
          </md-layout>
        </md-layout>

        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100">
            <mu-select-field
              v-model="task.manager"
              :label="$t('Manager')"
              :maxHeight="500"
              fullWidth
              labelFloat
            >
              <mu-menu-item
                v-for="user in users"
                :key="user.user._id"
                :value="user.user._id"
                :title="user.user.firstName + ' ' + user.user.lastName"
              />
            </mu-select-field>
          </md-layout>
          <md-layout md-flex-xsmall="100">
            <mu-select-field
              v-model="task.subscribers"
              :label="$t('Executors')"
              :maxHeight="500"
              fullWidth
              multiple
              labelFloat
            >
              <mu-menu-item
                v-for="user in users"
                :key="user.user._id"
                :value="user.user._id"
                :title="user.user.firstName + ' ' + user.user.lastName"
              />
            </mu-select-field>
          </md-layout>
        </md-layout>

        <mu-text-field
          :label="$t('Description')"
          multiLine
          labelFloat
          fullWidth
          v-model="task.descr"
          :rows="2"
          class="descr"
        />
        <br />
        <mu-raised-button
          slot="actions"
          @click="saveTask"
          primary
          :label="$t('Save')"
        />
        <mu-flat-button
          slot="actions"
          primary
          @click="cancel"
          :label="$t('Cancel')"
        />
      </form>
    </mu-dialog>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import groupBy from 'group-array';
import textEditable from './ui/text-editable';
import datePicker from './ui/date-picker';
import tableStats from './table-stats';
import tableRow from './table-row';

export default {
  components: {
    textEditable,
    tableStats,
    datePicker,
    tableRow,
    draggable
  },
  props: ['tableData', 'users', 'isAdmin'],
  data(){
    return {
      openModal: false,
      sort: null,
      hideDone: true,
      draggable: false,
      search: false,
      query: '',
      grouped: false,
      statuses: [
        {icon: 'watch', value: 'waiting', id: 1},
        {icon: 'check', value: 'done', id: 2},
        {icon: 'close', value: 'not_done', id: 3},
        {icon:'working', value: 'working', id: 4},
        {icon: 'watch_later', value: 'snooze', id: 5},
      ],
      task: {}
    }
  },
  computed: {
    tasks() {
      let tasks = this.tableData.tasks

      if(this.sort)
        tasks.sort((a,b) => {
          if(this.sort.name === 'timeLast'){
            a = a[this.sort.name];
            b = b[this.sort.name];
          } else {
            a = new Date(a[this.sort.name]);
            b = new Date(b[this.sort.name]);
          }
          if(this.sort.type !== 'asc')
              return a - b
          else
              return b - a
        })

      if(this.grouped)
        return groupBy(tasks, row => row.manager.firstName + ' ' + row.manager.lastName);
      else
        return {list: tasks};
    }
   },
    methods: {
      titleWidth(title){
        return (title && title.length > 54)? '100' : '66'
      },
      isVisible(task){
        return task.title.toLowerCase().match((this.query || '').toLowerCase()) && //Error?
        !(this.hideDone && (task.status === 'done' || task.status === 'not_done'))
      },
      onSort (sort) {
        this.sort = sort;
        this.$forceUpdate();
      },
      statusHandler() {
        this.$nextTick(()=>{
          if(this.task.status === 'working' && !this.task.start)
            this.task.start = new Date();
          if((this.task.status === 'done' || this.task.status === 'not_done') && !this.task.finish)
            this.task.finish = new Date();
        })
      },
      move(e) {
        this.$store.commit('card/SORT_TABLE', {_id: this.tableData._id, old: e.oldIndex, new: e.newIndex});
        this.$store.dispatch('card/updateTable', this.tableData);
      },
      save({title}) {
        if(title && this.tableData.title === title) return false;

        this.$store.dispatch('card/updateTable', {
          title: title,
          _id: this.tableData._id
        })
      },
      cancel(){
        this.openModal = false
        this.clearForm()
      },
      clearForm(){
        this.task = {
          _id: null,
          title: '',
          status: '',
          descr: '',
          manager: null,
          subscribers: [],
          finish: null,
          start: null
        }
      },
      saveTask(){
        let task = this.task;

        if(task.title == '')
          return this.$toast.error(this.$t('Enter name'))

        let callback = () => {
          this.openModal = false
          this.clearForm()
          this.grouped = false
        }

        if(this.task._id)
          this.$store.dispatch('card/updateTask', {
            tableId: this.tableData._id,
            task
          }).then(callback);
        else
          this.$store.dispatch('card/addTask', {
            tableId: this.tableData._id,
            task
          }).then(callback);
      },
      deleteTask(id) {
        if(confirm(this.$t('Are you sure?'))){
          let index = this.tableData.tasks.findIndex(t => t._id === id);
          this.tableData.tasks.splice(index, 1);
          this.$store.dispatch('card/updateTable', this.tableData);
        }
      },
      newTask() {
        this.clearForm();
        this.openModal = true
      },
      editTask(task){
        if(this.isAdmin){
          this.task = JSON.parse(JSON.stringify(task));
          this.task.manager = this.task.manager._id;
          this.task.subscribers = this.task.subscribers.map(s => s._id);
          this.openModal = true
        }
      },
      deleteTable(){
        if(confirm(this.$t('Are you sure?')))
           this.$store.dispatch('card/deleteTable', this.tableData._id);
      },
      reorder(direction){
        this.$store.dispatch('card/sortTables', {
          up: direction.up,
          down: direction.down,
          tableId: this.tableData._id
        });
      }
  }
};
</script>

<style>
  .table .md-table-head-text i{
    margin-left:-5px !important
  }
  .table .md-table-head-text{
    font-size: 11px
  }
  .table td:last-child .md-table-cell-container{
    padding-left:0;
  }

  .table .md-table-cell-container,
  .table .md-table-head-text{
    padding-right:10px !important;
    padding-left:15px !important;
  }

  .md-table-cell-container{
    display: block !important;
  }
</style>
<style scoped>
	.table{
		margin-top: 20px;
	}

  .md-table{
    max-height:90vh;
  }

  .mu-text-field.descr{
    font-size: 13px
  }

  .searchfield{
    margin-top: -2px;
    margin-right:10px;
    padding-top: 10px
  }

  h4.groupName{
    font-size:110%;
  }

  .active{
    background: #ebebeb
  }

  .md-title{
    margin-top:5px;
    line-height: 23px
  }

  .avatar{
    margin-left:3px
  }
</style>

<template>

  <md-table-row>

    <md-table-cell>
        <span class="task-title">{{task.title}}</span>
    </md-table-cell>

    <md-table-cell md-numeric>
      <md-button class="md-clean" v-if="task.timeLast">
        {{task.timeLast}}
        <md-tooltip md-direction="top" v-if="task.timeLeft && task.status != 'done'">
          {{$t('{left} work days to deadline',{left: task.timeLeft})}}
        </md-tooltip>
      </md-button>
    </md-table-cell>

    <md-table-cell>
        <mu-icon-button
          v-if="task.status"
          :tooltip="$t(status(task.status, task.finish).value)"
          tooltipPosition="top-left"
          :icon="status(task.status).icon"
          :iconClass="overdue(task.status, task.finish)" />
    </md-table-cell>

    <md-table-cell>
        <span v-if="task.start">{{task.start | moment('dddd, DD MMMM YYYY')}}</span>
    </md-table-cell>

    <md-table-cell>
        <span v-if="task.finish">{{task.finish | moment('dddd, DD MMMM')}}</span>
    </md-table-cell>

    <md-table-cell v-if="!grouped">
      <avatar
        v-if="task.manager"
        :user="task.manager"
        :tooltip="true" />
    </md-table-cell>

    <md-table-cell style="min-width: 108px">
      <avatar
        v-for="user in task.subscribers"
        v-if="user != null"
        :key="user._id"
        :user="user"
        :tooltip="true" />
    </md-table-cell>

    <md-table-cell @click.native="editable = true">
          <text-editable
              :placeholder="$t('Description')"
              class="descr"
              v-model="task.descr"
              :editable="editable"
              @save="saveDescr(task, arguments[0])"
        />
    </md-table-cell>

    <md-table-cell class="menu">
      <mu-icon-menu icon="more_vert" v-if="isAdmin">
            <mu-menu-item leftIcon="edit" :title="$t('Edit')" @click="editTask(task)" />
            <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="deleteTask(task._id)" />
      </mu-icon-menu>
    </md-table-cell>
  </md-table-row>
</template>

<script>

import textEditable from '../ui/text-editable';
import avatar from '../ui/avatar'

export default {
  name: 'table-row',
  components: {
    textEditable,
    avatar
  },
  props: ['task','statuses','grouped','tableId', 'isAdmin'],
  data: () => ({
    editable: false,
  }),
  methods: {
    status(value, finish){
      let s = this.statuses.find(s => s.value === value)
      return  {
        icon: s.icon,
        value: (this.overdue(value,finish))? this.$t('Overdue') : s.value
      }
    },
    overdue(status, finish){
      return (status === 'working' && finish && new Date(finish) < new Date())? 'overdue' : ''
    },
    saveDescr(task, {title}){
      if(task.descr === title) {
        this.editable = false
        return false;
      }
      task.descr = title;
      this.$store.dispatch('updateTask', {
        tableId: this.tableId,
        task
      }).then(()=>{
          this.editable = false
      });
    },
    deleteTask(id) {
      this.$emit('delete', id)
    },
    editTask(task){
      this.$emit('edit', task)
    },
  }
};
</script>

<style scope>
  .descr{
     text-align: justify;
     font-size: 12px;
     white-space: pre-line;
     margin-bottom: -5px
  }
  .descr:hover{
    cursor: text
  }
  .md-clean{
    padding:0
  }
  .task-title{
    font-size: 104%
  }
  .overdue{
    color:#5f0202
  }
</style>
<style>
  .menu .mu-icon-button{
    padding:0;
    width:20px;
    display: none
  }
  .menu .md-table-cell-container{
    padding: 0 !important
  }

  .md-table-cell-container{
    justify-content: flex-start !important;
    text-align: left
  }

  tr:hover .menu .mu-icon-button{
    display: block;
  }
</style>

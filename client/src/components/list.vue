<template>
  <div class="list">

    <md-table-card>
      <md-toolbar>
        <text-editable
              :placeholder="$t('List name')"
              class="md-title"
              :editable="listData.editable"
              @makeEditable="makeEditable"
              :value="listData.title"
              :inline="true"
              @save="save"/>

        <mu-icon-menu icon="more_vert" v-if="isAdmin">
              <mu-menu-item leftIcon="add" :title="$t('New task')" @click="newTask"  />
              <mu-menu-item leftIcon="edit" :title="$t('Rename')" @click="makeEditable" />
              <mu-menu-item leftIcon="clear" :title="$t('Clear done')" @click="clear" />
              <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="deleteList" />
        </mu-icon-menu>

      </md-toolbar>

      <draggable
        :list="listData.tasks"
        class="dragArea"
        :options="{group:'tasks', disabled: !isAdmin, animation: 300}"
        @change="save">
          <div
            class="list-task"
            :class="{ done: task.done }"
            v-for="(task, index) in tasks"
            :key="task._id"
            >
              <md-checkbox
                v-model="task.done"
                @change="saveTask(task,{title:task.title},true)"
                :disabled="!isAdmin"
              />

              <div class="task-title">
                <text-editable
                      :placeholder="$t('Task name')"
                      class="task-field"
                      :inline="true"
                      :listItem="index"
                      :value="task.title"
                      :editable="task.editable"
                      @makeEditable="(isAdmin)? task.editable = true : false; $forceUpdate()"
                      @save="saveTask(task, arguments[0])"
                />
              </div>

          </div>

      </draggable>

</md-table-card>


  </div>

</template>

<script>
import draggable from 'vuedraggable';
import textEditable from '../ui/text-editable';

export default {
  name: 'list',
  props: ['listData', 'hideDone', 'isAdmin'],
  components: {
    textEditable,
    draggable,
  },
  computed: {
    tasks(){
      return this.listData.tasks.filter(t => !(this.hideDone && t.done))
    }
  },
  methods: {
    save({title}) {
        this.listData.editable = false;
        this.$forceUpdate();

        if(title && this.listData.title === title) return false;

        this.$store.dispatch('updateList', {
          _id: this.listData._id,
          title
        });
    },
    saveTask(task, {title, itemIndex}, forceSave){
      task.editable = false;
      this.$forceUpdate();

      let tasks = this.listData.tasks;
      if(!title){
          let index = tasks.findIndex(t => t._id === task._id)
          if(index > -1) tasks.splice(index,1);
      } else {
          let t = tasks.find(t => t._id === task._id);
          if(t.title === title && !forceSave) {
            if(itemIndex > -1) this.newTask(itemIndex);
            return false;
          }
          t.title = title;
          if(t._id === 1) delete t._id;
      }

      this.$store.dispatch('updateList', {
        _id: this.listData._id,
        tasks
      }).then(()=>{
        if(itemIndex > -1 && title) this.newTask(itemIndex);
      })
    },
    newTask(index) {
      const task = {title: '', _id: 1, done: false, editable:true};
      if(index > -1)
        this.listData.tasks.splice(index + 1, 0, task);
      else
        this.listData.tasks.push(task);
    },
    clear(){
      this.listData.tasks = this.listData.tasks.filter(t => !t.done)
      this.save(false)
    },
    deleteList(){
      this.$store.dispatch('deleteList', this.listData._id);
    },
    makeEditable(){
      if(this.isAdmin)
        this.listData.editable = true;
      this.$forceUpdate();
    }
 },
};
</script>


<style scoped>
	.list{
		margin: 20px;
    max-width: 620px;
    min-width:350px;
    flex: 1
	}
  .md-toolbar .md-title:first-child{
    font-size:105%;
    margin-left: 5px
  }
  .list-task{
    will-change: transform;
    padding: 0px 20px;
    border-top:1px solid #ebebeb;
    font-size:90%;
    display: flex;
    max-width: 700px;
    align-items: center;
  }
  .task-title{
    display: inline-block;
    padding-left:5px;
    width: 100%
  }
  .task-field.mu-text-field{
    font-size: 13px;
    margin-bottom:-6px;
    width: 100%
  }
  .done{
    background: #ebebeb;
    color:#666;
  }
  .dragArea{
    min-height: 20px
  }
  .md-checkbox{margin: 12px 8px 12px 0}
</style>

<style>
   .listTask .md-checkbox .md-checkbox-container{
      width:15px;
      height:15px;
    }
</style>

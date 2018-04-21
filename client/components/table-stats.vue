<template>
  <div calss="table-stats">
    <section class="status-bar" @mouseover="stats(true)" @mouseleave="stats(false)">
      <div :style="{'background-color': '#388E3C', 'width': doneNumber/allNumber*100+'%'}">
      </div>
      <div :style="{'background-color': '#EF5350', 'width': notDoneNumber/allNumber*100+'%'}">
      </div>
      <div :style="{'background-color': '#29B6F6', 'width': workingNumber/allNumber*100+'%'}">
      </div>
    </section>
    <transition name="fade">
      <md-whiteframe class="custom-popover" md-tag="section" v-if="statsOn">
         <div class="pop-el">
           <div :style="{'background-color': '#388E3C'}">{{doneNumber}}</div>
            {{$t('Done tasks')}}
          </div>
          <div class="pop-el">
           <div :style="{'background-color': '#EF5350'}">{{notDoneNumber}}</div>
             {{$t('Not done tasks')}}
          </div>
          <div class="pop-el">
           <div :style="{'background-color': '#29B6F6'}">{{workingNumber}}</div>
             {{$t('Tasks in progress')}}
          </div>
          <div class="pop-el">
           <div :style="{'background-color': '#ccc'}">{{othersNumber}}</div>
             {{$t('Other tasks')}}
          </div>
      </md-whiteframe>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'table-stats',
  props: ['tasks'],
  data(){
    return {
      statsOn: false
    }
  },
  computed: {
    doneNumber(){
      return this.tasks.filter(t => t.status === 'done').length
    },
    notDoneNumber(){
      return this.tasks.filter(t => t.status === 'not_done').length
    },
    workingNumber(){
      return this.tasks.filter(t => t.status === 'working').length
    },
    othersNumber(){
      return this.tasks.filter(t => (['done','not_done','working'].indexOf(t.status) < 0)).length
    },
    allNumber(){
      return this.tasks.length
    }
  },
  methods: {
    stats(status){
      this.statsOn = status;
    }
  },
};
</script>

<style>
  .status-bar{
    position: absolute;
    top:0;
    left:0;
    height:4px;
    background: #ebebeb;
    width:100%;
    z-index:200000;
    display: flex;
  }
  .status-bar:hover{
    cursor: pointer;
  }
  .custom-popover{
    z-index:20000;
    top:0;
    background: #fff;
    position: absolute;
    margin-top:10px;
  }
  .status-bar div{
    height:4px;
    display: inline-block;
  }
  .pop-el{
    padding:20px;
    display: inline-block;
  }
  .pop-el div{
    color:#fff;
    font-weight: bold;
    height:24px;
    width: 24px;
    display: inline-block;
    text-align: center;
    line-height: 24px;
    margin-right: 5px;
    border-radius: 12px
  }
</style>

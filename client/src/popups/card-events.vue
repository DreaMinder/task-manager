<template>
  <md-sidenav class="md-right md-fixed" ref="rightSidenav">
   <md-toolbar>
      <div class="md-toolbar-container">
        <!-- <mu-icon value="add" style="margin-right:20px" />  -->
        <h3 class="md-title">{{$t('Card events')}}</h3>
      </div>
    </md-toolbar>

    <mu-timeline class="timeline">

     <mu-timeline-item v-for="event in events" :key="event._id" v-if="cardId">
       <span slot="time">{{event.date | moment('LLL')}}</span>
       <mu-icon value="edit" slot="icon" v-if="event.action.includes('edit')" />
       <mu-icon value="add" slot="icon" v-if="event.action.includes('new')" />
       <span slot="des">
         <avatar :user="event.user" :tooltip="true" class="sm"></avatar>
         {{$t(event.action)}} <span v-if="event.title">: {{event.title}} </span>
       </span>
     </mu-timeline-item>

     <mu-infinite-scroll
       :scroller="scroller"
       :loading="loading"
       loadingText=""
       @load="load"
     />
   </mu-timeline>
  </md-sidenav>
</template>

<script>
import { request } from '../store';
import avatar from '../ui/avatar'

export default {
  name: 'card-events',
  props: ['card-id'],
  components: {
    avatar
  },
  data (){
   return {
     events: [],
     limit: 1,
     loading: false,
     scroller: null
   }
  },
  mounted () {
    this.scroller = this.$el.firstElementChild
  },
  methods: {
    toggle() {
      this.$refs.rightSidenav.open()
      this.load()
    },
    async load() {
      try {
        if(this.limit > 12 || !this.cardId) return false;
        this.loading = true
        let result = await request.get(global.baseURL +
                                    '/events/card/' +
                                    this.cardId +
                                    '?limit=' +
                                    this.limit*10 );

        this.events = result.data;
        this.loading = false;
        this.limit++;
      } catch(error){
        console.log(error);
        this.loading = false
      }
    }
  },
};
</script>

<style scoped>
  .timeline{
    padding:30px 40px
  }
  .mu-infinite-scroll{
    margin-top:20px;
    height:50px
  }
</style>
<style>
  .mu-timeline-item-des {
    font-size: 14px!important;
    line-height: 20px;
    padding-top:5px;
  }
</style>

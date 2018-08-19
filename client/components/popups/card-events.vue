<template>
  <md-sidenav class="md-right md-fixed card-events" ref="rightSidenav">
   <md-toolbar>
      <div class="md-toolbar-container">
        <h3 class="md-title">{{$t('Card events')}}</h3>
      </div>
    </md-toolbar>
    <mu-timeline class="timeline">
     <mu-timeline-item v-for="event in events" :key="event._id" v-if="cardId">
       <span slot="time">{{event.date | moment('LLL', $moment)}}</span>
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
        let result = await this.$axios(`/events/card/${this.cardId}?limit=${this.limit*10}`);

        this.events = result.data;
        this.limit++;
      } catch(error){
        console.error(error)
        this.$toast.error(error)
      } finally {
        this.loading = false;
      }
    }
  },
};
</script>

<style>
  .card-events .timeline{
    padding:30px 40px
  }
  .card-events .mu-infinite-scroll{
    margin-top:20px;
    height:50px
  }
  .mu-timeline-item-des {
    font-size: 14px!important;
    line-height: 20px;
    padding-top:5px;
  }
</style>

<template>
    <div class="avatar" @mouseenter="show = true" @mouseleave="show = false">
        <mu-tooltip verticalPosition="top" :label="user.firstName+ ' ' +user.lastName" :show="show" v-if="tooltip" />
        <img :src="'/uploads/avatar/'+user.avatar" v-if="user.avatar">
        <div class="fallback" v-else>
          {{user.firstName[0]}}{{user.lastName[0]}}
        </div>
    </div>
</template>

<script>
export default {
  name: 'avatar',
  props: ['user','tooltip'],
  data () {
   return {
     show: false
   }
 }
};
</script>
<style scope>
  .avatar {
    width: 40px;
    min-width: 40px;
    height: 40px;
    min-height: 40px;
    margin: auto;
    display: inline-block;
    user-select: none;
    position: relative;

    vertical-align: middle;
  }
  .avatar img {
      overflow: hidden;
      border-radius: 40px;
      width: 100%;
      height: 100%;
      display: block;
  }
  .fallback{
    height: 40px;
    width: 40px;
    padding: 10px;
    background: #ccc;
    text-align: center;
    border-radius: 20px
  }
  .fallback:hover{
    cursor: default;
  }
  .md .fallback {
    padding: 5px 10px
  }
  .sm .fallback{
    height: 30px;
    width:30px;
    font-size: 12px;
    padding: 0 6px;
    line-height: 30px
  }
  .avatar.sm{
    margin:0px 5px 0 0;
    height:30px;
    width: 30px;
    min-width: 30px;
    min-height: 30px;
  }
</style>

<template>
  <div class="trash">
    <draggable
      :list="cards"
      class="dragArea"
      :options="{group:'cards', animation: 200}"
      @change="save"
    >
      <div :key="1"></div>
    </draggable>

    <mu-float-button
      icon="delete"
      secondary
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable';

export default {
  name: 'trash',
  props: ['cards', 'selected'],
  components: {
    draggable
  },
  methods: {
    save() {
        this.$emit('save', {
            title: this.groupTitle,
            _id: this._id
        });
    },
  }
};
</script>

<style scoped>
  .trash{
      background: rgba(0,0,0,.4);
      transition: all .3s;
      width: 350px;
      display: inline-block;
      will-change: transform;
      display: flex;
      border-radius: 0 30px 30px 0;
  }

  /*.mu-icon-button.selected{
      background: #333
  }*/

 .trash .dragArea, .trash .dragArea span{
      display: block;
      overflow: hidden;
      flex:1;
      padding:5px;
      height: 55px
  }
</style>
<style>
  .trash .dragArea .group-card{margin:0}
  .trash .dragArea .group-card .md-card-content{
    padding: 10px !important;
    height: 45px !important;
    overflow: hidden;
    line-height: 18px !important
  }
  .trash .dragArea .group-card .md-card{
    min-height: 45px !important;
    overflow: hidden;
  }
  .trash .dragArea .group-card .md-card-actions{display: none}
</style>

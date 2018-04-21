<template>
  <div id="boards">

    <section class="boards-wrap">

      <boardCard
        v-for="card in boards"
        :key="card._id"
        :board="card"
        @edit="editBoard"
      />

      <mu-float-button
        class="float-button"
        icon="add"
        :title="$t('New Board')"
        @click="openModal = true; clearForm()"
      />

    </section>

    <mu-dialog :open="openModal" :title="(this.board._id)? $t('Board Settings') : $t('New Board')" @close="openModal = false">
      <form>
        <md-layout md-gutter>
          <md-layout md-flex-xsmall="100" md-flex-medium="66" md-flex-large="66">
            <mu-text-field :label="$t('Name')" :hintText="$t('Board name')" fullWidth v-model="board.title" required />
          </md-layout>
          <md-layout md-flex-xsmall="100" md-flex-medium="33" md-flex-large="33">
            <mu-text-field label="URL" :hintText="$t('ID for short link')" fullWidth v-model="board.slug" required :disabled="!!board._id" />
          </md-layout>
        </md-layout>

        <mu-text-field :label="$t('Description')" :hintText="$t('Short board description')" v-model="board.descr" fullWidth />

        <md-input-container v-if="board._id">
          <label>{{$t('Board image')}}</label>
          <md-file v-model="board.image" accept="image/*" :disabled="imgLoading" @selected="onFileUpload($event)"></md-file>
        </md-input-container>

        <br />
        <mu-raised-button slot="actions" @click="save" primary :label="(this.board._id)? $t('Save'): $t('New Board')"/>
        <mu-flat-button slot="actions" primary @click="openModal = false;" :label="$t('Cancel')"/>
        <mu-flat-button slot="actions" style="float:right" v-if="board._id" icon="delete" secondary @click="deleteBoard"/>
      </form>
    </mu-dialog>

  </div>
</template>

<script>
import boardCard from '@/components/board-card';

export default {
  name: 'boards',
  components: {
    boardCard
  },
  head(){
    return {
      title: this.$t('boards')
    }
  },
  computed: {
    boards(){
      return this.$store.getters['board/boards']
    }
  },
  async fetch ({ error, store }) {
    await store.dispatch('board/getBoards')
  },
  data(){
   	return {
      board: {},
      imgLoading: false,
      openModal: false
    }
  },
  methods: {
    clearForm(){
      this.board = {
        _id: null,
        title: '',
        slug: '',
        descr: '',
        image: null
      }
    },
    save(){
      let board = this.board;

      if(board.title == '') {
        this.$toast.error(this.$t('Enter name'))
        return
      }

      if(this.board._id)
        this.$store.dispatch('board/updateBoard', {
          _id: this.board._id,
          title: this.board.title,
          slug: this.board.slug,
          descr: this.board.descr,
          image: this.board.image
        }).then(()=>{
          this.openModal = false;
          this.clearForm()
        });
      else
        this.$store.dispatch('board/addBoard',{
          title: this.board.title,
          slug: this.board.slug,
          descr: this.board.descr,
          image: this.board.image
        }).then(()=>{
          this.openModal = false;
          this.clearForm()
        });
    },
    editBoard(board){
      this.board = board;
      this.openModal = true;
    },
    async onFileUpload (event) {
      this.imgLoading = true;
      var data = new FormData();
      data.append('image', event[0]);

      let result = await request.put('/images/board', data);
      this.board.image = result.data.name;
      this.imgLoading = false;
    },
    deleteBoard (){
      if (confirm(this.$t('Are you sure?')))
          this.$store.dispatch('board/deleteBoard', this.board._id).then(()=>{
            this.openModal = false;
          });
    }
 },
}
</script>

<style>
  #boards{
    height: 100%;
    width: 100%;
    overflow: auto;
    position: absolute;
    -webkit-overflow-scrolling: touch;
    top:0;
    left: 0
  }

  .boards-wrap{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding:50px;
    max-width: 1400px;
    margin: 20px auto;
  }

  @media (max-width: 600px){
    .boards-wrap{
      padding:15px
    }
  }
</style>

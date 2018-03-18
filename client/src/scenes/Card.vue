<template>
<transition name="fade">
  <div id="card">

    <section class="tags" v-if="card.tags">
      <mu-icon-button
        v-for="tag in cardTags"
        :key="tag._id"
        :style="{backgroundColor: tag.color}"
        :tooltip_="tag.title"
      />
    </section>

    <div class="background" @click.self="goBack"></div>

    <section class="card-wrap">
      <div class="card-header">

                <mu-icon-button
                      icon="arrow_back"
                      @click="goBack"
                />

                <text-editable
                      v-if="card._id"
                      :inline="true"
                      :placeholder="$t('Card name')"
                      class="card-title"
                      :value="card.title"
                      :editable="card.editable"
                      @makeEditable="(isAdmin)? card.editable = true : false"
                      @save="save"
                />
                <div class="card-title" v-else>...</div>

                <mu-icon-menu icon="more_vert" v-if="isAdmin">
                      <mu-menu-item leftIcon="edit" :title="$t('Rename')" @click="card.editable = true" />
                      <mu-menu-item leftIcon="delete" :title="$t('Delete')" @click="deleteCard" />
                </mu-icon-menu>
      </div>

      <div class="card-body" v-if="card.tables">

          <section id="notes" v-if="card.notes[0]">
              <note
                  v-for="note in card.notes"
                  :key="note._id"
                  :user="card.user"
                  :isAdmin="isAdmin"
                  :cardId="card._id"
                  :note="note" />
          </section>

          <section id="lists" v-if="card.lists[0]">
              <list
                  v-for="list in lists"
                  :key="list._id"
                  :isAdmin="isAdmin"
                  :listData="list"
              />
          </section>

          <section id="tables" v-if="card.tables[0]">
              <taskTable v-for="table in card.tables"
                    v-if="showTables"
                    :key="table._id"
                    :tableData="table"
                    :users="card.users"
                    :isAdmin="isAdmin"
              />
          </section>

          <section id="new" v-if="isAdmin && !card.tables[0] && !card.notes[0] && !card.lists[0]">
              <mu-flat-button :label="$t('New note')" icon="note" @click.native="newNote" />
              <mu-flat-button :label="$t('New ToDo list')" icon="dashboard" @click.native="newList" />
              <mu-flat-button :label="$t('New task table')" icon="dns" @click.native="newTable" />
          </section>

      </div>
    </section>


    <md-speed-dial md-open="hover" md-direction="left" class="md-fab-bottom-right" v-if="isAdmin">
      <md-button class="md-fab md-primary" md-fab-trigger>
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>add</md-icon>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="newNote">
        <md-icon>note</md-icon>
        <md-tooltip md-direction="top">{{$t('New note')}}</md-tooltip>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="newList">
        <md-icon>dashboard</md-icon>
        <md-tooltip md-direction="top">{{$t('New ToDo list')}}</md-tooltip>
      </md-button>

      <md-button class="md-fab md-primary md-mini md-clean" @click.native="newTable">
        <md-icon>dns</md-icon>
        <md-tooltip md-direction="top">{{$t('New task table')}}</md-tooltip>
      </md-button>
    </md-speed-dial>

    <mu-raised-button @click="scrollTo" class="back-top" icon="expand_less" v-if="scrolled" />

  </div>

</transition>
</template>

<script>
import {mapGetters} from 'vuex';
import textEditable from '../ui/text-editable';
import taskTable from '../components/table';
import list from '../components/list';
import note from '../components/note';


export default {
  name: 'card',
  components: {
    note,
    taskTable,
    textEditable,
    list
  },
  methods: {
    goBack (){
      let allowed = true;
      if(this.noteEditable && !confirm(this.$t('leave')))
        allowed = false;
      if(this.backLink && allowed){
        this.$router.push({
          name: 'Board',
          params: {
            slug: this.backLink
          }
        });
        this.$store.dispatch('endEdit');
      }
    },
    save({title}) {
      this.card.editable = false;
      this.$store.dispatch('updateCard', {
        title,
        _id: this.card._id
      });
    },
    deleteCard: function(option) {
      if (confirm(this.$t('Data will be lost. Are you sure?'))) {
        this.$store.dispatch('deleteCard', this.card._id).then(() => {
          this.goBack()
        })
      }
    },
    newList() {
      this.$store.dispatch('addList', {
        cardId: this.card._id
      });
    },
    newTable() {
      this.$store.dispatch('addTable', {
        cardId: this.card._id
      });
    },
    newNote() {
      this.$store.dispatch('addNote', {
        cardId: this.card._id
      });
    },
    scrollTo(to){
      this.container.scrollTop = to || 0;
    },
    handleScroll(){
      if(!this.scrolled && this.container.scrollTop > 2) this.$store.dispatch('startScroll');
      if(this.scrolled && this.container.scrollTop === 0) this.$store.dispatch('endScroll');
    }
  },
  data() {
    return {
      container: null,
      showTables: false,
    }
  },
  computed: {
    cardTags() {
      return this.card.tags.filter(tag => {
        return this.card.board.tags.find(t => t._id === tag._id)
      }).map(tag => {
        return this.card.board.tags.find(t => t._id === tag._id)
      })
    },
    ...mapGetters({
      card: 'card',
      lists: 'lists',
      isAdmin: 'isCardAdmin',
      backLink: 'backLink',
      scrolled: 'scrolled',
      noteEditable: 'editable'
    })
  },
  async beforeCreate() {
    await this.$store.dispatch('getCard', this.$route.params.id);
    setTimeout(()=>{
      this.showTables = true;
    },150)
  },
  mounted(){
    this.container = this.$el;
    this.container.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    this.container.removeEventListener('scroll', this.handleScroll);
  }
}
</script>


<style scoped>
  #card {
    position: absolute;
    padding: 40px 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  #new{
    padding: 50px 30px;
    line-height: 50px;
    margin: 50px auto;
    opacity: .8;
    width:300px
  }
  #new:hover{
    opacity: 1
  }

  .background:hover{
    cursor: pointer;
    background: rgba(0,0,0,.1);
  }
  .background{
    background: rgba(0,0,0,0);
    transition: all .2s ease;
    position: fixed;
    width:100%;
    height:100%;
    margin-top: -40px;
    margin-left: -20px
  }

  .card-wrap {
    position: relative;
    background: #f3f3f3;
    margin: 10px auto 0;
    padding-bottom: 20px;
    min-width: 400px;
    max-width: 1400px;
    box-sizing: border-box;
    min-height: 75%;
    box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.4);
  }
  .card-header {
    padding: 5px;
    background: #ebebeb;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  .card-title {
    min-width: 200px;
    flex: 1;
    padding: 10px;
    line-height: 26px;
    font-size: 18px;
    letter-spacing: 0
  }
  .card-title:hover{
    cursor: text !important
  }

  #tables {
    padding: 20px
  }

  #lists{
    display: flex;
    flex-wrap: wrap;
    position: relative;
  }
  .mu-text-field{
    margin-top: -8px;
    margin-bottom:-15px
  }

  .back-top{
    position: fixed;
    bottom:40px;
    left:40px;
    z-index:200;
    -webkit-backface-visibility: hidden;
  }
  .md-speed-dial{
    position: fixed;
    right: 40px;
    -webkit-backface-visibility: hidden;
  }
  .tags > .mu-icon-button:hover{
    margin-top:0px;
    cursor: default !important
  }
</style>

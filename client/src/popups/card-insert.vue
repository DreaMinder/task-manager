<template>
  <mu-dialog :open="open" :title="$t('Insert card from another board')" @close="$emit('close')">
    <form>
      <mu-auto-complete
        :hintText="$t('card-hint')"
        :label="$t('Board name')"
        fullWidth
        :maxHeight="300"
        filter="noFilter"
        :dataSourceConfig="{text: 'title', value: '_id'}"
        @input="handleInput"
        @select="handleChange"
        :dataSource="cards"
      />
      <br />
      <br />
      <mu-raised-button
        :disabled="!selectedCard"
        slot="actions"
        @click.native="$emit('save',selectedCard)"
        primary
        :label="$t('Insert card')"
      />
      <mu-flat-button
        slot="actions"
        primary
        @click="$emit('close')"
        :label="$t('Cancel')"
      />
    </form>
  </mu-dialog>
</template>

<script>
import axios from 'axios';

export default {
  name: 'card-insert',
  props: ['open'],
  data (){
    return {
      cards: [],
      selectedCard: null,
    }
  },
  methods: {
    handleChange (val) {
      this.selectedCard = val._id
    },
    async handleInput (query) {
      if (query.length === 0) return;
      this.$store.dispatch('startPreload')

      let result = await axios.get(global.baseURL + '/cards?search='+query);
      this.cards = result.data;

      this.$store.dispatch('endPreload')
    },
  },
};
</script>

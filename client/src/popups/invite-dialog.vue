<template>
  <mu-dialog
    :open="open" :title="$t('Invite new user')" @close="$emit('close')"
  >
      <mu-text-field
        label="Email"
        :hintText="$t('Enter email adress of a new user')"
        v-model="email"
        fullWidth
      />
      <mu-raised-button
        :disabled="!email"
        slot="actions"
        @click="send"
        primary
        :label="$t('Send invite')"
      />
      <mu-flat-button
        slot="actions"
        primary
        @click="$emit('close')"
        :label="$t('Cancel')"
      />
    </div>
  </mu-dialog>
</template>

<script>

export default {
  name: 'invite-dialog',
  props: ['open'],
  data (){
    return {
      email: null
    }
  },
  methods: {
    async send(){
      await this.$store.dispatch('invite', {
        email: this.email,
        message: this.$t('Invite has been sent')
      });
      this.$emit('close')
    }
  },
  watch: {
    open: function() {
      this.email = null
    }
  }
};
</script>

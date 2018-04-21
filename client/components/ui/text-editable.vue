<template>
    <mu-text-field
      v-if="editable"
      :hintText="placeholder"
      v-focus="!inline"
      v-focus-inline="inline"
      :multiLine="!inline"
      :max="20"
      :rowsMax="12"
      :errorText="errorText"
      :class="{'white': white}"
      fullWidth
      v-model="text"
      @blur="save"
      @textOverflow="overflow"
      @keyup.native.enter="save"
      @keyup.native.delete="remove"
    />
    <div v-else @click="makeEditable">{{ text }}</div>
</template>

<script>

export default {
  name: 'text-editable',
  props: ['value','listItem','white','inline','editable','placeholder'],
  data: function () {
    return {
      text: this.value,
      empty: !this.value,
      errorText: ''
    }
  },
  methods: {
    remove(){
      if(this.listItem > -1){
        if(this.empty) this.save({});

        if(!this.text) this.empty = true;
        else this.empty = false;
      }
    },
    save(event){
      if(!this.errorText && this.editable){
        let payload = {title: this.text};
        if(event.key === 'Enter')
          if(!this.inline)
            return false;
          else if(this.listItem > -1)
            payload.itemIndex = this.listItem;

        this.$emit('save', payload)
      }
    },
    makeEditable(){
      this.$emit('makeEditable')
    },
    overflow(isOverflow) {
      this.errorText = isOverflow ? 'Сестра - краткость таланта...' : ''
    }
  },
  watch: {
    value (value) {
      if(!this.editable) this.text = value
    }
  },
  directives: {
    focusInline:  {
      inserted: (el) => {
        el
        .firstElementChild
        .firstElementChild
        .nextElementSibling
        .focus()
      }
    },
    focus:  {
      inserted: (el) => {
      try{
        el
        .firstElementChild
        .firstElementChild
        .nextElementSibling
        .firstElementChild
        .nextElementSibling
        .focus()
      } catch(err){}
      }
    }
  }
};
</script>

<style>
  .mu-text-field textarea{
    overflow: hidden;
  }
  .mu-text-field.white,
  .mu-text-field.white input,
  .mu-text-field.white .mu-text-field-hint{
    color: #fff
  }
</style>

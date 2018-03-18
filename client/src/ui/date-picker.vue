<template>
  <div class="date-picker">
    <mu-date-picker
      :label="label"
      fullWidth
      labelFloat
      autoOk
      format="DD-MM-YYYY"
      okLabel="OK"
      cancelLabel="Отмена"
      :dateTimeFormat="dateFormat"
      container="inline"
      mode="landscape"
      :value="date"
      @change="save"
    />
    <mu-icon-button icon="cancel" @click.native="clear" />
  </div>
</template>

<script>
import moment from 'moment'
const dayAbbreviation = moment.weekdaysMin()
const dayList = moment.weekdaysShort()
const monthList = moment.monthsShort()
const monthLongList = moment.months()

export default {
  name: 'date-picker',
  props: ['label', 'value'],
  data () {
    return {
      date: (this.value)? moment(this.value).format('DD-MM-YYYY') : undefined,
      dateFormat: {
        formatDisplay (date) {
          return `${monthList[date.getMonth()]} ${date.getDate()}`
        },
        formatMonth (date) {
          return `${monthLongList[date.getMonth()]} ${date.getFullYear()}`
        },
        getWeekDayArray (firstDayOfWeek) {
          let beforeArray = []
          let afterArray = []
          for (let i = 0; i < dayAbbreviation.length; i++) {
            if (i < firstDayOfWeek) {
              afterArray.push(dayAbbreviation[i])
            } else {
              beforeArray.push(dayAbbreviation[i])
            }
          }
          return beforeArray.concat(afterArray)
        }
      }
    }
  },
  methods: {
    save(value){
      let date = value.split('-').reverse().join('-')
      this.$emit('input',date)
    },
    clear(){
      this.date = undefined;
      this.$emit('input',null)
    }
  },
  watch: {
    value(value){
       this.date = (value)? moment(value).format('DD-MM-YYYY') : undefined
    }
  }
};
</script>
<style scoped>
  .date-picker{
    width: 100%;
    position: relative;
  }
  .date-picker:hover .mu-icon-button{
    opacity: .3
  }
  .mu-icon-button{
    position: absolute;
    right:0;
    top:20px;
    opacity: 0
  }
</style>

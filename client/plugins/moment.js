import Vue from 'vue'

Vue.filter('moment', function(date, pattern, moment) {
  return moment(date).format(pattern)
});

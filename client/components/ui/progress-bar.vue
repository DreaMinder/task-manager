<template>
  <div class="progress-bar"  v-if="loading">
  <transition name="ui-progress-linear--transition-fade">
    <div class="ui-progress-linear ui-progress-linear--type-indeterminate">
      <div
        class="ui-progress-linear__progress-bar"
        role="progressbar"
        :aria-valuemax="100"
        :aria-valuemin="0"
      />
    </div>
  </transition>
</div>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style>
.ui-progress-linear {
	display: block;
	height: 4px;
	overflow: hidden;
	position: relative;
	transition-duration: 0.3s;
	transition-property: height, opacity;
	transition-timing-function: ease;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.4);
	position: fixed;
	top:0;
	z-index: 1000
}

.ui-progress-linear__progress-bar::before {
	animation: ui-progress-linear-indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
	background-color: inherit;
	content: '';
	height: 4px;
	left: 0;
	position: absolute;
	top: 0;
}

.ui-progress-linear__progress-bar::after {
	animation-delay: 1.15s;
	animation: ui-progress-linear-indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
	background-color: inherit;
	content: '';
	height: 4px;
	left: 0;
	position: absolute;
	top: 0;
}

@keyframes ui-progress-linear-indeterminate {
	0% {
		left: -35%;
		right: 100%;
	}

	60% {
		left: 100%;
		right: -90%;
	}

	100% {
		left: 100%;
		right: -90%;
	}
}

@keyframes ui-progress-linear-indeterminate-short {
	0% {
		left: -200%;
		right: 100%;
	}

	60% {
		left: 107%;
		right: -8%;
	}

	100% {
		left: 107%;
		right: -8%;
	}
}

.ui-progress-linear--transition-fade-enter-active,
.ui-progress-linear--transition-fade-leave-active {
	transition: opacity 0.3s ease;
}

.ui-progress-linear--transition-fade-enter,
.ui-progress-linear--transition-fade-leave-active {
	opacity: 0;
}

.ui-progress-linear__progress-bar {
	background-color: white;
}
</style>

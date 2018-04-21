<template>
  <div id="error">
  	<section v-if="error.statusCode === 404">
  		<h1>404</h1>
  		<h2>{{ $t('Not Found') }}</h2>
  	</section>
    <section v-else>
      <pre>{{ error }}</pre>
  	</section>
  </div>
</template>

<script>
export default {
  props: ['error'],
  head: {
    title: 'Error'
  }
}
</script>

<style>
	#error section {
    display: block;
    background-color: rgba(0,0,0,.2);
    text-align: center;
    color:#fff;
    margin: 100px 0;
    padding: 50px
	}

  #error h1{
    font-weight:normal;
    font-size: 40px
  }
</style>

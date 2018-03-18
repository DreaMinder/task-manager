<template>
  <div id="not-found">
  	<section>
  		<h1>404</h1>
  		<h2>{{ $t('Not Found') }}</h2>
  	</section>
  </div>
</template>

<script>
export default {
  name: 'not-found'
};
</script>

<style scoped>
	section {
	    display: block;
	    background-color: rgba(0,0,0,.2);
	    text-align: center;
      color:#fff;
      margin: 100px 0;
      padding: 50px
	}

  h1{
    font-weight:normal;
    font-size: 40px
  }
</style>

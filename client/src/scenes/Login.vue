<template>
  <div id="login">
  	<section>

  		<h1>{{$t('Login')}}</h1>

  		<form @submit.prevent="login">

            <mu-text-field
              label="Email"
              labelFloat
              type="email"
              v-model="email"
            />

            <mu-text-field
              :label="$t('Password')"
              labelFloat
              type="password"
              v-model="password"
            />

            <md-button class="md-raised md-primary" type="submit">
              {{ $t('Login') }}
            </md-button>

      </form>
  	</section>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      this.$store.dispatch("login", {
        email: this.email,
        password: this.password
      }).then(()=>{
        this.$router.push("/")
      }).catch(()=>{
        this.$store.dispatch('handleError',
          new Error(this.$t('Check your email or password')))
      })
    }
  },
  mounted() {
    this.$store.dispatch('endPreload')
  }
};
</script>

<style scoped>
	section {
	    display: block;
	    max-width: 400px;
	    background-color: rgba(0,0,0,.2);
	    text-align: center;
      color:#fff;
	}
  form{
    padding: 60px;
    background: rgba(255,255,255,.95)
  }
	#login{
	    display: flex;
	    justify-content: center;
	    align-items: center;
	    padding: 30px;
	    height: 100%;
      min-width: 400px;
      min-height: 400px;
	    box-sizing: border-box;
	}
	.md-button{
		margin-top: 30px
	}
  h1{
    font-weight:normal;
    font-size: 30px;
    padding:20px;
    text-transform: uppercase
  }
</style>

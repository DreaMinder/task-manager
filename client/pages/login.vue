<template>
  <div id="login">
  	<section>
  		<h1>{{$t('login')}}</h1>

  		<form @submit.prevent="login">
        <mu-text-field
          label="Email"
          labelFloat
          type="email"
          v-model="email"
          required
        />

        <mu-text-field
          :label="$t('password')"
          labelFloat
          required
          type="password"
          v-model="password"
        />

        <md-button class="md-raised md-primary" type="submit">
          {{ $t('login') }}
        </md-button>
      </form>
  	</section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  head(){
    return {
      title: this.$t('login')
    }
  },
  methods: {
    login() {
      this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password
        }
      }).catch(e => {
        console.error(e);
        let error = e;
        if(e.response && e.response.status === 401)
          error = this.$t('Check your email or password')

        this.$toast.error(error)
      })
    }
  }
};
</script>

<style>
	#login section {
    display: block;
    max-width: 400px;
    background-color: rgba(0,0,0,.2);
    text-align: center;
    color:#fff;
	}
  #login form{
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
	#login .md-button{
		margin-top: 30px
	}
  #login h1{
    font-weight:normal;
    font-size: 30px;
    padding:20px;
    text-transform: uppercase
  }
</style>

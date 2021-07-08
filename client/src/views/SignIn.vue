<template>
  <div>Sign in</div>
  <br>
  <form @submit.prevent="onSubmit">
    <label for="email">Email</label>
    <input type="email" id="email" v-model="email">
    <br>
    <br>
    <label for="email">Password</label>
    <input type="password" id="password" v-model="password">
    <button type="submit">Войти</button>
  </form>
  <br>
  <a :href="googleAuthURL">Войти с google</a>
  <br>
  <router-link to="/sign-up">Нет аккаунта?</router-link>
</template>

<script>
  import { API_URL } from '../constants';
  import querystring from 'query-string';

  export default {
    name: 'SignIn',
    data: () => ({
      email: null,
      password: null,
      googleAuthURL: null,
      clientGoogleId: '440399066496-073ba9nn6cscov1g2bivm4oc0po3v5ml.apps.googleusercontent.com'
    }),
    methods: {
      async onSubmit() {
        try {
          if(this.email && this.password) {
            await this.$store.dispatch('signIn', {
              email: this.email,
              password: this.password
            });
            await this.$router.push('/');
          } else {
            alert('Enter all the inputs');
          }
        } catch (e) {
          console.log(e);
        }
      },

      getGoogleURL() {
        const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
        const options = {
          redirect_uri: `${API_URL}/auth/google-sign-up`,
          client_id: this.clientGoogleId,
          access_type: "offline",
          response_type: "code",
          prompt: "consent",
          scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
          ].join(" "),
        };
        return `${rootUrl}?${querystring.stringify(options)}`;
      }
    },
    beforeMount() {
      this.googleAuthURL = this.getGoogleURL();
    }
  };
</script>

<style scoped>

</style>
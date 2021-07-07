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
  <router-link to="/sign-up">Нет аккаунта?</router-link>
</template>

<script>
  export default {
    name: 'SignIn',
    data: () => ({
      email: null,
      password: null
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
      }
    }
  };
</script>

<style scoped>

</style>
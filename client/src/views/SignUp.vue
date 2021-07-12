<template>
  <div>Sign up</div>
      <br>
  <form @submit.prevent="onSubmit">
    <label for="email">Email </label>
    <input type="email" id="email" v-model="email" placeholder="test@gmail.com">
    <br>
    <br>
    <label for="email">Password </label>
    <input type="password" id="password" v-model="password" placeholder="password...">
        <br>
        <br>
    <button type="submit">Зарегистрироватся</button>
  </form>
      <br>
  <router-link to="/sign-in">Уже есть аккаунт?</router-link>
</template>

<script>

  export default {
    name: 'SignUp',
    data: () => ({
      email: null,
      password: null
    }),
    methods: {
      async onSubmit() {
        try {
          if(this.email && this.password) {
            await this.$store.dispatch('signUp', {
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
    },
    
  };
</script>

<style scoped>

</style>
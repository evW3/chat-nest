<template>
  <div class="home">
    <nav>
      <router-link to="/sign-up">Регистрация</router-link>
      <br>
      <router-link to="/sign-in">Вход</router-link>
    </nav>
  </div>
</template>

<script>

export default {
  name: 'Home',
  data: () => ({  }),
  methods: {  },
  async beforeMount() {  }
}
</script>

<style lang="scss"></style>
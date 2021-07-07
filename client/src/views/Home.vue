<template>
  <div class="home">
    <form @submit.prevent="onSubmit">
      <input v-model="text" type="text" placeholder="Message...">
      <button type="submit">Send</button>
    </form>
    <div>
      <ul>
        <li v-for="message in chat">{{ message }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { API_URL } from '../constants';

  export default {
    name: 'Home',
    data: () => ({
      text: '',
      chat: [],
      socket: null
    }),
    methods: {
      onSubmit() {
        if (this.token) {
          this.socket.emit('messageToServer', this.text);
          this.text = '';
        } else {
          console.log('Error');
        }
      }
    },
    computed: {
      ...mapGetters(['user'])
    },
    async beforeMount() {
      try {
        this.$store.dispatch('fetchAdmin');
        this.socket = io(`${API_URL}`, {
          query: {
            token: this.user.token
          }
        });

        this.socket.on('newMessage', msg => {
          this.chat.push(msg);
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
</script>

<style lang="scss"></style>
<template>
  <div class="home">
    <form @submit.prevent="onSubmit">
      <input v-model="text" type="text" placeholder="Message...">
      <button type="submit">Send</button>
    </form>
    <div>
      <ul>
        <li v-for="chatObj in chat">{{ chatObj.message.text }} | {{ chatObj.message.date }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import { API_URL } from '../constants';
  import SocketIO from 'socket.io-client';

  export default {
    name: 'Home',
    data: () => ({
      text: '',
      chat: [],
      socket: null
    }),
    methods: {
      onSubmit() {
        if (this.user.token) {
          this.socket.emit('chatMessage', {
            token: this.user.token,
            message: this.text
          });
          this.text = '';
        } else {
          console.log('Error');
        }
      }
    },
    computed: {
      ...mapGetters(['user'])
    },
    async mounted() {
      try {
        this.$store.dispatch('fetchAdmin');
        this.socket = SocketIO(API_URL, {
          query: {
            token: this.user.token
          }
        });
        if(this.socket) {
          this.socket.on('newMessage', msg => {
            this.chat.push(msg);
          });

          this.socket.on('initChat', chatHistory => {
            this.chat = chatHistory;
          });

          this.socket.on('error', err => {
            this.chat.push(err);
          });

          this.socket.emit('getChatHistory');
        }
      } catch (e) {
        console.log(e);
      }
    }
  }
</script>

<style lang="scss"></style>
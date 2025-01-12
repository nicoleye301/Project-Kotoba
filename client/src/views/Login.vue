<script setup lang="ts">
import {ref} from "vue";
import axiosInstance from "../utils/request.ts";

const username = ref('')
const password = ref('')

const get = () => {
  axiosInstance.get('/weather')
}

</script>

<template>
  <div class="container">
    <h1>Login</h1>
    <form @Submit={} class="form">
      <input
          v-model="username"
          type=text
          placeholder="Enter your username"
          @Change={}
          required
          class="input"
      />
      <input
          type="password"
          placeholder="Enter your password"
          v-model="password"
          @Change={}
          required
          class="input"
      />
      <button type="submit" class="button">
        Confirm
      </button>
    </form>
    <p>
      Don't have an account?{' '}
      <span @Click={} class="link">
      Sign up
      </span>
    </p>
  </div>
</template>

<style scoped>
.container {
  max-width: 400px;
  margin: 50px auto;
  text-align: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  background-color: #0c0c0c;
  color: #ffffff;
}

.form {
  display: flex;
  flex-direction: column;
}

.input {
  margin: 5px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #232627;
  border-radius: 05px;
  background-color: #232627;
  color: #ffffff;
}

.button {
  margin: 15px 15px 10px auto;
  padding: 10px 15px;
  font-size: 16px;
  background-color: #27b961;
  color: #000000;
  border: none;
  border-radius: 50px;
  cursor: pointer;
}

.link {
  color: #27b961;
  cursor: pointer;
}

</style>
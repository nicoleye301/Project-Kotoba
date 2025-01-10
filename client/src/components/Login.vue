<script setup lang="ts">
const username = 'user1'
</script>

<template>
  <div class="container">
    <h1>Login</h1>
    <form @Submit={} class="form">
      <input
          type="text"
          placeholder="Enter your username"
          :value='username'
          @Change={}
          required
          class="input"
      />
      <input
          type="password"
          placeholder="Enter your password"
          value=''
          @Change={}
          required
          class="input"
      />
      <button type="submit" class="button">
        Login
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
  background-color: #2c2f33;
  color: #ffffff;
}

.form {
  display: flex;
  flex-direction: column;
}

.input {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #42454a;
  border-radius: 4px;
  background-color: #40444b;
  color: #ffffff;
}

.button {
  padding: 10px;
  font-size: 16px;
  background-color: #7289da;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.link {
  color: #7289da;
  cursor: pointer;
}

</style>
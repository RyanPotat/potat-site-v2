<script setup lang="ts">
import { ref } from 'vue';
import { fetchBackend } from '../assets/request';

const 

inputUrl = ref(''),
response = ref(''),

fetchData = async () => {
  try {
    const res = await fetchBackend('redirect', {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: inputUrl.value.trim() }),
      method: 'POST'
    })

    if (res.errors?.length) {
      response.value = res.errors[0].message;
      return;
    }

    response.value = res.data[0]?.url;
  } catch (error) {
    console.error('Error fetching data:', error);
    response.value = 'Error fetching data';
  }
},

copyToClipboard = () => {
  const textarea = document.createElement('textarea');
  textarea.value = response.value;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
};
</script>

<template>
  <div class="container">
    <div class="input-container">
      <input type="text" id="urlInput" v-model="inputUrl" placeholder="Input URL" class="textbox" />
      <button @click="fetchData" class="submit-button">Submit</button>
    </div>
    <div class="response-container">
      <input type="text" readonly :value="response" placeholder="Shortened URL" class="textbox" />
      <button @click="copyToClipboard" class="copy-button">Copy</button>
    </div>
  </div>
</template>

<style scoped>

.container {
  width: 400px;
  margin: auto;
  background-color: rgba(31, 31, 31, 0.906);
  border-radius: 15px;
  padding: 20px;
  overflow-y: auto;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.input-container {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.textbox {
  width: 100%;
  font-size: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button,
.copy-button {
  padding: 8px 16px;
  font-size: 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
}

button:hover {
  background-color: #0056b3;
}

.response-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

</style>
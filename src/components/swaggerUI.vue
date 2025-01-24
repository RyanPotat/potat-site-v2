<script>
import { defineComponent } from 'vue'
import '@/assets/swagger-ui/swagger-ui.css'
import SwaggerUI from '@/assets/swagger-ui/swagger-ui-es-bundle.js'
import SwaggerUIStandalonePreset from '@/assets/swagger-ui/swagger-ui-standalone-preset.js'

// https://github.com/char0n/swagger-ui-vite-dist thank you to this guy holy fork
export default defineComponent({
  mounted() {
    SwaggerUI({
      url: '/swagger.yaml',
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUI.presets.apis,
        SwaggerUIStandalonePreset,
      ],
      layout: 'StandaloneLayout',
    })
  }
});
</script>

<template>
  <div id="swagger-ui"></div>
</template>

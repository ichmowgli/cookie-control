<template>
  <div>
    <CookieControl :locale="locale" />

    <iframe
      src="https://player.vimeo.com/video/259622029?h=8dd8029ca1"
      width="640"
      height="480"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    />

    <fieldset>
      <legend>Choose a language</legend>
      <div>
        <label for="input-en">English</label>
        <input id="input-en" v-model="locale" type="radio" value="en" />
      </div>
      <div>
        <label for="input-sk">Slovak</label>
        <input id="input-sk" v-model="locale" type="radio" value="sk" />
      </div>
    </fieldset>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '../src/runtime/types'

const locale = ref<Locale>('en')
</script>

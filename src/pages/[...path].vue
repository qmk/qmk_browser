<template>
  <v-empty-state headline="Whoops!" title="Page not found">
    <template v-slot:text>
      The page you were looking for does not exist
    </template>

    <template v-slot:actions>
      <v-btn color="primary" to="/">Return home</v-btn>
    </template>

    <template v-slot:media>
      <v-img class="ma-10" src="@/assets/logo.svg" height="30vh"/>
    </template>
  </v-empty-state>
</template>

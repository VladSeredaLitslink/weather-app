<script setup lang="ts">
import GeolocationContainer from "@/components/GeolocationContainer.vue";
import WeatherForecast from "@/components/WeatherForecast.vue";
</script>

<template>
  <GeolocationContainer>
    <WeatherForecast />
  </GeolocationContainer>
</template>

<style>
#app * {
  font-family: "Montserrat";
}
</style>

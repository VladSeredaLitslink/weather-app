<script lang="ts" setup>
import type { WeatherData } from "@/api/models/ro/weather";

import TheBox from "@/components/TheBox.vue";

defineProps<{
  data?: WeatherData;
}>();
</script>

<template>
  <TheBox v-if="data">
    <p class="text-center text-xl text-gray-500 mb-4">
      Feels like
      <span class="font-bold text-black"> {{ data?.app_temp }}° </span>
    </p>

    <div
      class="relative text-6xl text-black w-45 h-45 rounded-full shadow-2xl font-bold flex justify-center items-center mx-auto mb-4"
    >
      {{ data?.temp }}°

      <img
        class="w-20 absolute -top-2 -left-2"
        :src="`https://www.weatherbit.io/static/img/icons/${data?.weather.icon}.png`"
        :alt="`${data?.weather.description} Icon`"
      />
    </div>

    <p class="text-gray-500 text-base text-center mb-2">
      {{ data?.weather.description }}
    </p>

    <p class="text-black text-base text-center mb-4 font-bold">
      {{ data?.city_name }}
    </p>

    <div
      class="flex justify-between border-t border-solid border-gray-300 pt-2 mb-4"
    >
      <div class="text-base text-gray-500 flex">
        <img
          src="@/images/wind-speed.jpeg"
          class="w-5 mr-2"
          alt="Wind Speed Icon"
        />
        {{ data?.wind_spd }}
      </div>

      <div class="text-base text-gray-500 flex">
        <img src="@/images/humidity.png" class="w-5 mr-2" alt="Humidity Icon" />
        {{ data?.rh }}%
      </div>

      <div class="text-base text-gray-500 flex">
        <img
          src="@/images/clouds-coverage.png"
          class="w-5 mr-2"
          alt="Clouds Coverage Icon"
        />
        {{ data?.clouds }}%
      </div>
    </div>

    <slot name="actions" />
  </TheBox>
</template>

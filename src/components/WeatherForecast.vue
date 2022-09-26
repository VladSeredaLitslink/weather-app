<script lang="ts" setup>
import { computed, inject, ref } from "vue";

import LocationSelector from "@/components/LocationSelector.vue";
import LoadingOverlay from "@/components/LoadingOverlay.vue";
import WeatherPresentation from "@/components/WeatherPresentation.vue";

import ThunderStormImg from "@/images/200.webp";
import RainImg from "@/images/300.jpeg";
import LightRainImg from "@/images/500.jpeg";
import WinterImg from "@/images/600.jpeg";
import FogImg from "@/images/700.jpeg";
import SunImg from "@/images/800.webp";
import UnknownImg from "@/images/900.jpeg";

import {
  useCurrentWeatherQuery,
  useWeatherForCityQuery,
} from "@/api/queries/current-weather";
import {
  THUNDERSTORM_CODES,
  DRIZZLE_CODES,
  RAIN_CODES,
  SNOW_CODES,
  SUNNY_CODES,
  FOG_CODES,
} from "@/api/services/weather/current-weather";
import { userGeolocationKey } from "@/helpers/inject-keys";
import type { CurrentWeatherCityDTO } from "@/api/models/dto/weather";

const geolocation = inject(userGeolocationKey);
const { latitude, longitude } = geolocation?.value?.coords ?? {};

const cityWeatherData = ref<CurrentWeatherCityDTO>();
const isManualSelection = ref(!geolocation?.value);

const {
  data: currentWeather,
  isLoading: isLoadingCurrentWeather,
  isError: isCurrentWeatherError,
} = useCurrentWeatherQuery(
  latitude && longitude ? { lat: latitude, lon: longitude } : undefined
);
const {
  data: cityWeather,
  isLoading: isCityWeatherLoading,
  isError: isCityWeatherError,
} = useWeatherForCityQuery(cityWeatherData);

const weatherData = computed(() => cityWeather.value ?? currentWeather.value);
const isLoading = computed(
  () => isCityWeatherLoading.value || isLoadingCurrentWeather.value
);
const isError = computed(
  () => isCityWeatherError.value ?? isCurrentWeatherError.value
);
const weatherTileImg = computed(() => {
  /**
   * @description
   * a representation-only example
   * (not all images strictly represent the current weather, just a simple visualisation)
   */
  const weatherCode = weatherData.value?.data[0].weather.code ?? 900;

  if (THUNDERSTORM_CODES.includes(weatherCode)) {
    return ThunderStormImg;
  }

  if (DRIZZLE_CODES.includes(weatherCode)) {
    return RainImg;
  }

  if (RAIN_CODES.includes(weatherCode)) {
    return LightRainImg;
  }

  if (FOG_CODES.includes(weatherCode)) {
    return FogImg;
  }

  if (SUNNY_CODES.includes(weatherCode)) {
    return SunImg;
  }

  if (SNOW_CODES.includes(weatherCode)) {
    return WinterImg;
  }

  return UnknownImg;
});
</script>

<template>
  <section
    class="w-full h-full flex justify-center items-center bg-cover bg-no-repeat"
    :style="{ backgroundImage: `url(${weatherTileImg})` }"
  >
    <div v-if="isError" class="px-3 py-2 bg-red-300 text-red-600">
      Failed to fetch the weather data. Unknown error
    </div>

    <template v-else>
      <LocationSelector
        v-if="isManualSelection"
        :show-back-button="Boolean(currentWeather?.data[0])"
        :weather="cityWeather?.data[0]"
        @submit="cityWeatherData = $event"
        @set-manual="isManualSelection = false"
      />

      <WeatherPresentation v-else :data="currentWeather?.data[0]" class="w-80">
        <template #actions>
          <button
            class="text-center border border-gray-300 w-full rounded-lg px-3 py-2 bg-gray-200 text-gray-500"
            type="button"
            @click="isManualSelection = true"
          >
            Manually select a location
          </button>
        </template>
      </WeatherPresentation>
    </template>

    <LoadingOverlay v-if="isLoading" />
  </section>
</template>

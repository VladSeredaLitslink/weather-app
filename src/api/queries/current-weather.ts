import { useQuery } from "vue-query";

import {
  fetchWeatherByGeolocation,
  fetchWeatherForCity,
} from "@/api/services/weather/current-weather";
import type {
  CurrentWeatherDTO,
  CurrentWeatherCityDTO,
} from "@/api/models/dto/weather";
import type { WeatherRO } from "@/api/models/ro/weather";
import { computed, type Ref } from "vue";

export const useCurrentWeatherQuery = (params?: CurrentWeatherDTO) => {
  return useQuery<WeatherRO>(
    "current-weather",
    () => fetchWeatherByGeolocation(params!),
    { enabled: Boolean(params) }
  );
};

export const useWeatherForCityQuery = (
  params: Ref<CurrentWeatherCityDTO | undefined>
) => {
  return useQuery<WeatherRO>(
    ["city-weather", params],
    () => fetchWeatherForCity(params.value!),
    { enabled: computed(() => Boolean(params.value?.city)) }
  );
};

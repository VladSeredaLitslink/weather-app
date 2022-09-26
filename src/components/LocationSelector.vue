<script lang="ts" setup>
import { computed, reactive } from "vue";

import { useCountriesQuery } from "@/api/queries/countries";
import type { CurrentWeatherCityDTO } from "@/api/models/dto/weather";
import type { WeatherData } from "@/api/models/ro/weather";

import SelectorItem from "@/components/SelectorItem.vue";
import TheBox from "@/components/TheBox.vue";
import WeatherPresentation from "@/components/WeatherPresentation.vue";

defineEmits<{
  (event: "submit", data: CurrentWeatherCityDTO): void;
  (event: "set-manual"): void;
}>();
defineProps<{
  weather?: WeatherData;
  showBackButton: boolean;
}>();

const form = reactive<CurrentWeatherCityDTO>({
  country: "US",
  city: "",
});

const { data: countries } = useCountriesQuery();

const relatedCities = computed(() => {
  const country = countries.value?.data.find(
    (item) => item.iso2 === form.country
  );

  return country?.cities ?? [];
});
</script>

<template>
  <TheBox class="w-90">
    <SelectorItem id="country" label="Select a country">
      <select
        v-model="form.country"
        id="country"
        class="p-2 rounded-xl border border-gray-300"
        @change="form.city = ''"
      >
        <option
          v-for="item in countries?.data"
          :key="item.country"
          :value="item.iso2"
        >
          {{ item.country }}
        </option>
      </select>
    </SelectorItem>

    <SelectorItem id="city" label="Select a city">
      <select
        v-model="form.city"
        id="city"
        class="p-2 rounded-xl border border-gray-300"
        @change="$emit('submit', { ...form })"
      >
        <option v-for="item in relatedCities" :key="item" :value="item">
          {{ item }}
        </option>
      </select>
    </SelectorItem>

    <WeatherPresentation v-if="weather" :data="weather">
      <template #actions>
        <button
          v-if="showBackButton"
          class="text-center border border-gray-300 w-full rounded-lg px-3 py-2 bg-gray-200 text-gray-500"
          type="button"
          @click="$emit('set-manual')"
        >
          Back
        </button>
      </template>
    </WeatherPresentation>
  </TheBox>
</template>

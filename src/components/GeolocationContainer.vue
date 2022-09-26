<script lang="ts" setup>
import { computed, provide, ref } from "vue";

import { userGeolocationKey } from "@/helpers/inject-keys";
import {
  GEOLOCATION_ERROR_MESSAGES,
  LOADING_GEOLOCATION_MESSAGE,
} from "./constants";

const geolocationData = ref<GeolocationPosition>();
const geolocationError = ref("");
const isManualSelection = ref(false);

const showUserMessage = computed(
  () =>
    !geolocationData.value &&
    !geolocationError.value &&
    !isManualSelection.value
);

navigator.geolocation.getCurrentPosition(
  (position) => {
    geolocationData.value = position;
  },
  (error) => {
    const messages: Record<number, string> = {
      [error.PERMISSION_DENIED]: GEOLOCATION_ERROR_MESSAGES.PERMISSION_DENIED,
      [error.POSITION_UNAVAILABLE]:
        GEOLOCATION_ERROR_MESSAGES.POSITION_UNAVAILABLE,
      [error.TIMEOUT]: GEOLOCATION_ERROR_MESSAGES.TIMEOUT,
    };

    geolocationError.value = messages[error.code];
  }
);

const handleManualSelection = () => {
  isManualSelection.value = true;
  geolocationError.value = "";
};

provide(userGeolocationKey, geolocationData);
</script>

<template>
  <section class="geolocation-container">
    <template v-if="showUserMessage">
      {{ LOADING_GEOLOCATION_MESSAGE }}
    </template>

    <div
      class="text-center text-base text-gray-500 p-4"
      v-else-if="geolocationError"
    >
      {{ geolocationError }}

      <button
        class="mt-4 text-center border border-gray-300 rounded-lg px-3 py-2 bg-gray-200 text-gray-500"
        type="button"
        @click="handleManualSelection"
      >
        Proceed with manual selection of the countries and cities
      </button>
    </div>

    <slot v-else />
  </section>
</template>

<style scoped>
.geolocation-container {
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script lang="ts" setup>
defineProps<{
  label: string;
}>();
</script>

<template>
  <div class="flex flex-col pt-2">
    <label
      class="text-base font-bold text-gray-500 mb-1"
      :for="($attrs.id as string)"
    >
      {{ label }}
    </label>

    <slot />
  </div>
</template>

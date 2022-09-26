<template>
  <div
    class="fixed top-0 left-0 h-full w-full z-10 bg-opacity-50 bg-gray-600 flex items-center justify-center"
  >
    <div class="spinner inline-block w-20 h-20" />
  </div>
</template>

<style lang="scss" scoped>
$spinner-color: #deeaee;

.spinner {
  &::after {
    @apply block w-20 h-20 m-2 rounded-full;
    content: "";
    border: 6px solid $spinner-color;
    border-color: $spinner-color transparent #deeaee transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

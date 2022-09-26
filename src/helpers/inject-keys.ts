import type { InjectionKey, Ref } from "vue";

export const userGeolocationKey = Symbol() as InjectionKey<
  Ref<GeolocationPosition | undefined>
>;

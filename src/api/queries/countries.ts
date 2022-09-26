import { useQuery } from "vue-query";

import { fetchCountries } from "@/api/services/countries";
import type { CountriesRO } from "@/api/models/ro/countries";

export const useCountriesQuery = () => {
  return useQuery<CountriesRO>("countries", fetchCountries);
};

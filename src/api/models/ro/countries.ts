export interface CountryRO {
  country: string;
  iso2: string;
  iso3: string;
  cities: string[];
}

export interface CountriesRO {
  data: CountryRO[];
  error: boolean;
  msg: string;
}

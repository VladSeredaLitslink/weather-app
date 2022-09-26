import type {
  CurrentWeatherCityDTO,
  CurrentWeatherDTO,
} from "@/api/models/dto/weather";

import { generateQueryParams } from "@/helpers/query-params";
import { WEATHER_API_KEY, WEATHER_BASE_URL } from ".";

export const fetchWeatherByGeolocation = async (params: CurrentWeatherDTO) => {
  const response = await fetch(
    `${WEATHER_BASE_URL}/current?key=${WEATHER_API_KEY}&${generateQueryParams(
      params
    )}`
  );
  return response.json();
};

export const fetchWeatherForCity = async (params: CurrentWeatherCityDTO) => {
  const response = await fetch(
    `${WEATHER_BASE_URL}/current?key=${WEATHER_API_KEY}&${generateQueryParams(
      params
    )}`
  );
  return response.json();
};

export const THUNDERSTORM_CODES = [200, 201, 202, 230, 231, 232, 233];
export const DRIZZLE_CODES = [300, 301, 302];
export const RAIN_CODES = [500, 501, 502, 511, 520, 521, 522];
export const SNOW_CODES = [600, 601, 602, 610, 611, 612, 621, 622, 623];
export const FOG_CODES = [700, 711, 721, 731, 741, 751];
export const SUNNY_CODES = [800, 801, 802, 803, 804];

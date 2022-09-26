export const BASE_GEOLOCATION_ERROR =
  "We will not be able to show the forecast in your region.";

export const GEOLOCATION_ERROR_MESSAGES = {
  PERMISSION_DENIED: `You forbid us to get your location. ${BASE_GEOLOCATION_ERROR}`,
  POSITION_UNAVAILABLE: `Your position is unavailable right now. ${BASE_GEOLOCATION_ERROR}`,
  TIMEOUT: `We could not get your location for unknown reason. ${BASE_GEOLOCATION_ERROR}`,
};

export const LOADING_GEOLOCATION_MESSAGE = "Getting your geolocation...";

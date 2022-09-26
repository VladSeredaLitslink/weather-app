export const fetchCountries = async () => {
  const response = await fetch("https://countriesnow.space/api/v0.1/countries");
  return response.json();
};

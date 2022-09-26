// eslint-disable-next-line
export const generateQueryParams = (payload: Record<any, any>) => {
  const params = new URLSearchParams();

  Object.keys(payload).forEach((key) => {
    params.append(key, String(payload[key]));
  });

  return params;
};

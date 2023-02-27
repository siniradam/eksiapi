export async function response(data, status) {
  return {
    status: !status || status == 200,
    time: Math.floor(Date.now() / 1000),
    data,
  };
}

export const apiPath = "/v1";

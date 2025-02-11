export function parseBotResponse<T extends unknown[]>(data: T) {
  return {
    messages: [
      {
        type: "to_user",
        content: data,
        media: "https://ejemplo.com/imagen.png",
      },
    ],
  };
}

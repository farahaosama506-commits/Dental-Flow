import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  return {
    locale: "ar",
    messages: (await import("../messages/ar.json")).default,
  };
});
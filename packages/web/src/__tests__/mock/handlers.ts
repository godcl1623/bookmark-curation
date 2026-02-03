import { SERVICE_ENDPOINTS } from "@linkvault/shared";
import { http, HttpResponse } from "msw";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
  http.patch(`${baseURL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`, () => {
    return HttpResponse.json({ ok: true });
  }),
];

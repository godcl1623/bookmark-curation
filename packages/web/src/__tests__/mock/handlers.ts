import { type Me, SERVICE_ENDPOINTS } from "@linkvault/shared";
import { http, HttpResponse } from "msw";

import { BASE_URL, EXAMPLES } from "../__utils__";

// TODO: handler 수준에서 validation 및 에러 처리 추가

export const handlers = [
  /* AUTH */
  // get me
  http.get(`${BASE_URL}${SERVICE_ENDPOINTS.AUTH.ME.path}`, () => {
    const response: HttpResponse<{ user: Me }> = HttpResponse.json({
      user: {
        id: 1,
        uuid: "aaaaa",
        email: "example@email.com",
        display_name: "test",
        avatar_url: "",
        locale: "",
      },
    });

    return response;
  }),
  // logout user
  http.post(`${BASE_URL}${SERVICE_ENDPOINTS.AUTH.LOGOUT.CURRENT.path}`, () => {
    return HttpResponse.json({
      message: "Logged out successfully",
    });
  }),
  // refresh token
  http.post(`${BASE_URL}${SERVICE_ENDPOINTS.AUTH.REFRESH.path}`, () => {
    return HttpResponse.json({
      access_token: "token",
      uuid: "aaaaa",
    });
  }),

  /* BOOKMARKS */
  // create new bookmark
  http.post(
    `${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}`,
    async ({ request }) => {
      const body = await request.json();

      if (!body) {
        return HttpResponse.json(
          { ok: false, error: "body is required" },
          { status: 400 }
        );
      }

      return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
    }
  ),
  // delete bookmark
  http.delete(`${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),
  // get bookmarks list
  // TODO: queryParams 처리 추가 필요
  http.get(
    `${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}`,
    ({ request }) => {
      const url = new URL(request.url);
      const search = url.searchParams.get("search");

      if (search) {
        return HttpResponse.json({ ok: true, data: [] });
      }

      return HttpResponse.json({ ok: true, data: [EXAMPLES.BOOKMARK] });
    }
  ),
  // patch bookmark
  http.patch(`${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),
  // update bookmark
  http.put(`${BASE_URL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:target`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),

  /* DIRECTORIES */
  // get directory by path
  http.get(`${BASE_URL}${SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: {
        folder: EXAMPLES.FOLDER,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
        path: "/",
        breadcrumbs: {},
      },
    });
  }),
  // get directory by contents
  http.get(`${BASE_URL}${SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: {
        parent_id: 1,
        folders: [EXAMPLES.FOLDER],
        bookmarks: [EXAMPLES.BOOKMARK],
      },
    });
  }),

  /* FOLDERS */
  // create new folder
  http.post(`${BASE_URL}${SERVICE_ENDPOINTS.FOLDERS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  }),
  // delete folder
  http.delete(`${BASE_URL}${SERVICE_ENDPOINTS.FOLDERS.path}/:id`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  }),
  // get folder list
  http.get(`${BASE_URL}${SERVICE_ENDPOINTS.FOLDERS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: [EXAMPLES.FOLDER],
    });
  }),
  // update folder
  http.put(`${BASE_URL}${SERVICE_ENDPOINTS.FOLDERS.path}/:target`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  }),

  /* TAGS */
  // create new tag
  http.post(`${BASE_URL}${SERVICE_ENDPOINTS.TAGS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.TAG,
    });
  }),
  // delete tag
  http.delete(`${BASE_URL}${SERVICE_ENDPOINTS.TAGS.path}/:id`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.TAG,
    });
  }),
  // get tags list
  http.get(`${BASE_URL}${SERVICE_ENDPOINTS.TAGS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: [EXAMPLES.TAG],
    });
  }),
  // update tag
  http.put(`${BASE_URL}${SERVICE_ENDPOINTS.TAGS.path}/:target`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.TAG,
    });
  }),
];

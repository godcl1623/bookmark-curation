import { type Me, SERVICE_ENDPOINTS } from "@linkvault/shared";
import { http, HttpResponse } from "msw";

import { EXAMPLES } from "../__utils__";

const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:3002";

export const handlers = [
  /* AUTH */
  // get me
  http.get(`${baseURL}${SERVICE_ENDPOINTS.AUTH.ME.path}`, () => {
    const response: HttpResponse<Me> = HttpResponse.json({
      id: 1,
      uuid: "aaaaa",
      email: "example@email.com",
      display_name: "test",
      avatar_url: "",
      locale: "",
    });

    return response;
  }),
  // logout user
  http.post(`${baseURL}${SERVICE_ENDPOINTS.AUTH.LOGOUT.CURRENT.path}`, () => {
    return HttpResponse.json({
      message: "Logged out successfully",
    });
  }),
  // refresh token
  http.post(`${baseURL}${SERVICE_ENDPOINTS.AUTH.REFRESH.path}`, () => {
    return HttpResponse.json({
      access_token: "token",
      uuid: "aaaaa",
    });
  }),

  /* BOOKMARKS */
  // create new bookmark
  http.post(`${baseURL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),
  // delete bookmark
  http.delete(`${baseURL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),
  // get bookmarks list
  // TODO: queryParams 처리 추가 필요
  http.get(`${baseURL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}`, () => {
    return HttpResponse.json({ ok: true, data: [EXAMPLES.BOOKMARK] });
  }),
  // patch bookmark
  http.patch(`${baseURL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:id`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),
  // update bookmark
  http.put(`${baseURL}${SERVICE_ENDPOINTS.BOOKMARKS.ALL.path}/:target`, () => {
    return HttpResponse.json({ ok: true, data: EXAMPLES.BOOKMARK });
  }),

  /* DIRECTORIES */
  // get directory by path
  http.get(`${baseURL}${SERVICE_ENDPOINTS.DIRECTORY.BY_PATH.path}`, () => {
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
  http.get(`${baseURL}${SERVICE_ENDPOINTS.DIRECTORY.CONTENTS.path}`, () => {
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
  http.post(`${baseURL}${SERVICE_ENDPOINTS.FOLDERS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  }),
  // delete folder
  http.delete(`${baseURL}${SERVICE_ENDPOINTS.FOLDERS.path}/:id`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  }),
  // get folder list
  http.get(`${baseURL}${SERVICE_ENDPOINTS.FOLDERS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: [EXAMPLES.FOLDER],
    });
  }),
  // update folder
  http.put(`${baseURL}${SERVICE_ENDPOINTS.FOLDERS.path}/:target`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.FOLDER,
    });
  }),

  /* TAGS */
  // create new tag
  http.post(`${baseURL}${SERVICE_ENDPOINTS.TAGS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.TAG,
    });
  }),
  // delete tag
  http.delete(`${baseURL}${SERVICE_ENDPOINTS.TAGS.path}/:id`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.TAG,
    });
  }),
  // get tags list
  http.get(`${baseURL}${SERVICE_ENDPOINTS.TAGS.path}`, () => {
    return HttpResponse.json({
      ok: true,
      data: [EXAMPLES.TAG],
    });
  }),
  // update tag
  http.put(`${baseURL}${SERVICE_ENDPOINTS.TAGS.path}/:target`, () => {
    return HttpResponse.json({
      ok: true,
      data: EXAMPLES.TAG,
    });
  }),
];

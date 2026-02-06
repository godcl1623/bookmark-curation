import {
  type Bookmark,
  type Folder,
  type Me,
  SERVICE_ENDPOINTS,
  type Tag,
} from "@linkvault/shared";
import { http, HttpResponse } from "msw";

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

interface Examples {
  BOOKMARK: Bookmark;
  FOLDER: Folder;
  TAG: Tag;
}

const EXAMPLES: Examples = {
  BOOKMARK: {
    data_id: "1",
    title: "title",
    url: "url",
    description: "description",
    metadata: {},
    parent_id: null,
    domain: "",
    favicon_url: "",
    preview_image: "",
    is_favorite: false,
    is_archived: false,
    is_private: false,
    type: "bookmark",
    folders: null,
    click_count: 0,
    created_at: "",
    deleted_at: "",
    id: 1,
    parent: null,
    position: 0,
    tags: [],
    updated_at: "",
    user_id: 1,
    view_count: 0,
    users: { id: 1, display_name: "user" },
    _count: { bookmarks: 0, children: 0 },
  },
  FOLDER: {
    _count: { bookmarks: 0, children: 0 },
    created_at: "",
    data_id: "1",
    deleted_at: "",
    id: 1,
    parent: null,
    parent_id: null,
    position: 0,
    title: "folder",
    type: "folder",
    updated_at: "",
    user_id: 1,
    users: { display_name: "user", id: 1 },
  },
  TAG: {
    name: "tag",
    color: "#000000",
    created_at: "",
    deleted_at: "",
    id: 1,
    slug: "tag",
    updated_at: "",
    user_id: 1,
    users: { id: 1, display_name: "user" },
    _count: { bookmark_tags: 0 },
  },
};

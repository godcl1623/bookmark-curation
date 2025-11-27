const SERVICE_ENDPOINTS = {
  HEALTH_CHECK: {
    SERVER: {
      path: "/health",
    },
    DB: {
      path: "/db-health",
    },
  },
  USERS: {
    path: "/users",
  },
  BOOKMARKS: {
    ALL: {
      path: "/bookmarks",
    },
    DETAIL: {
      path: "/bookmarks/:id",
      build: (id: string) => `/bookmarks/${id}`,
    },
  },
  FOLDERS: {
    path: "/folders",
  },
  DIRECTORY: {
    CONTENTS: {
      path: "/directory/contents",
    },
    BY_PATH: {
      path: "/directory/by-path",
    },
  },
  TAGS: {
    path: "/tags",
  },
  STATS: {
    path: "/stats",
  },
} as const;

export default SERVICE_ENDPOINTS;

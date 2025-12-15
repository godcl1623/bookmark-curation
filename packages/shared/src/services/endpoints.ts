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
  AUTH: {
    ME: {
      path: "/auth/me",
    },
    LOGOUT: {
      CURRENT: {
        path: "/auth/logout",
      },
      ALL: {
        path: "/auth/logout-all",
      },
    },
    REFRESH: {
      path: "/auth/refresh",
    },
    GOOGLE: {
      SIGNIN: {
        path: "/auth/google",
      },
      CALLBACK: {
        path: "/auth/google/callback",
      },
    },
  },
} as const;

export default SERVICE_ENDPOINTS;

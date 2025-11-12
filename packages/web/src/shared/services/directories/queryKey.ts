const DIRECTORY_QUERY_KEY = {
  CONTENTS: (folder_id: string | null) => [
    "directories",
    "contents",
    folder_id,
  ],
  BY_PATH: (pathname: string) => ["directories", "by_path", pathname],
};

export default DIRECTORY_QUERY_KEY;

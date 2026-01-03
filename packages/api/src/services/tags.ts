import prisma from "../lib/prisma";
import { encrypt, decrypt, createSearchHash } from "../lib/encryption";

function decryptTag(tag: any): any {
  if (!tag) return null;

  const decrypted = {
    ...tag,
    name: decrypt(tag.name),
  };

  if (decrypted.users) {
    decrypted.users = {
      ...decrypted.users,
      display_name: decrypted.users.display_name
        ? decrypt(decrypted.users.display_name)
        : null,
    };
  }

  return decrypted;
}

export async function getAllTags(
  userId: number,
  options?: {
    search?: string;
    sort_by?: "name" | "count";
    limit?: number;
  }
) {
  const { search, sort_by, limit } = options || {};

  let tags: any[];

  if (search && search.trim() !== "") {
    const searchHash = createSearchHash(search);

    const candidates = await prisma.tags.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
        OR: [
          { name_hash: searchHash },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      },
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        _count: {
          select: {
            bookmark_tags: {
              where: {
                bookmarks: {
                  deleted_at: null,
                },
              },
            },
          },
        },
      },
      ...(limit ? { take: limit } : {}),
    });

    const decryptedCandidates = candidates.map(decryptTag);

    tags = decryptedCandidates.filter((t: any) => {
      const nameMatch = t.name && t.name.toLowerCase().includes(search.toLowerCase());
      const slugMatch = t.slug && t.slug.toLowerCase().includes(search.toLowerCase());
      return nameMatch || slugMatch;
    });
  } else {
    const results = await prisma.tags.findMany({
      where: {
        user_id: userId,
        deleted_at: null,
      },
      include: {
        users: {
          select: {
            id: true,
            display_name: true,
          },
        },
        _count: {
          select: {
            bookmark_tags: {
              where: {
                bookmarks: {
                  deleted_at: null,
                },
              },
            },
          },
        },
      },
      ...(limit ? { take: limit } : {}),
    });

    tags = results.map(decryptTag);
  }

  if (sort_by === "count") {
    tags.sort((a, b) => b._count.bookmark_tags - a._count.bookmark_tags);
  } else {
    tags.sort((a, b) => a.name.localeCompare(b.name));
  }

  return tags;
}

export async function createTag(
  userId: number,
  data: {
    name: string;
    color?: string;
  }
) {
  const slug = data.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-|-$/g, "");

  const tag = await prisma.tags.create({
    data: {
      user_id: userId,
      name: encrypt(data.name)!,
      name_hash: createSearchHash(data.name),
      slug,
      color: data.color || null,
    },
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
        },
      },
      _count: {
        select: {
          bookmark_tags: {
            where: {
              bookmarks: {
                deleted_at: null,
              },
            },
          },
        },
      },
    },
  });

  return decryptTag(tag);
}

export async function updateTag(
  userId: number,
  tagId: number,
  data: {
    name?: string;
    color?: string;
  }
) {
  const existingTag = await prisma.tags.findFirst({
    where: {
      id: tagId,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!existingTag) {
    throw new Error("Tag not found or access denied");
  }

  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.name !== undefined) {
    updateData.name = encrypt(data.name);
    updateData.name_hash = createSearchHash(data.name);
    updateData.slug = data.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9가-힣]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  if (data.color !== undefined) {
    updateData.color = data.color;
  }

  const tag = await prisma.tags.update({
    where: { id: tagId },
    data: updateData,
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
        },
      },
      _count: {
        select: {
          bookmark_tags: {
            where: {
              bookmarks: {
                deleted_at: null,
              },
            },
          },
        },
      },
    },
  });

  return decryptTag(tag);
}

export async function deleteTag(userId: number, tagId: number) {
  const existingTag = await prisma.tags.findFirst({
    where: {
      id: tagId,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!existingTag) {
    throw new Error("Tag not found or access denied");
  }

  const tag = await prisma.tags.update({
    where: { id: tagId },
    data: {
      deleted_at: new Date(),
    },
  });

  return decryptTag(tag);
}

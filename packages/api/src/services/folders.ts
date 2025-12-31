import prisma from "../lib/prisma";
import { encrypt, decrypt, createSearchHash } from "../lib/encryption";

function decryptFolder(folder: any): any {
  if (!folder) return null;

  const decrypted = {
    ...folder,
    title: decrypt(folder.title),
  };

  if (decrypted.parent) {
    decrypted.parent = {
      ...decrypted.parent,
      title: decrypt(decrypted.parent.title),
    };
  }

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

export async function getAllFolders(userId: number) {
  const folders = await prisma.folders.findMany({
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
      parent: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      _count: {
        select: {
          bookmarks: true,
          children: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  return folders.map(decryptFolder);
}

export async function createFolder(
  userId: number,
  data: {
    data_id: string;
    title: string;
    color?: string;
    parent_id?: string;
  }
) {
  let parentFolderId: number | null = null;
  if (data.parent_id) {
    const parentFolder = await prisma.folders.findFirst({
      where: {
        data_id: data.parent_id,
        user_id: userId,
      },
      select: {
        id: true,
      },
    });

    if (!parentFolder) {
      throw new Error("Parent folder not found");
    }

    parentFolderId = parentFolder.id;
  }

  const maxPositionFolder = await prisma.folders.findFirst({
    where: {
      user_id: userId,
      parent_id: parentFolderId,
    },
    orderBy: {
      position: "desc",
    },
    select: {
      position: true,
    },
  });

  const newPosition = (maxPositionFolder?.position ?? -1) + 1;

  const folder = await prisma.folders.create({
    data: {
      data_id: data.data_id,
      user_id: userId,
      title: encrypt(data.title)!,
      title_hash: createSearchHash(data.title),
      color: data.color || null,
      parent_id: parentFolderId,
      position: newPosition,
    },
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
        },
      },
      parent: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      _count: {
        select: {
          bookmarks: true,
          children: true,
        },
      },
    },
  });

  return decryptFolder(folder);
}

export async function updateFolder(
  userId: number,
  dataId: string,
  data: {
    title?: string;
    color?: string;
    parent_id?: string;
    position?: number;
  }
) {
  const existingFolder = await prisma.folders.findFirst({
    where: {
      data_id: dataId,
      user_id: userId,
      deleted_at: null,
    },
  });

  if (!existingFolder) {
    throw new Error("Folder not found or access denied");
  }

  const updateData: any = {
    updated_at: new Date(),
  };

  if (data.title !== undefined) {
    updateData.title = encrypt(data.title);
    updateData.title_hash = createSearchHash(data.title);
  }

  if (data.color !== undefined) {
    updateData.color = data.color;
  }

  if (data.position !== undefined) {
    updateData.position = data.position;
  }

  if (data.parent_id !== undefined) {
    if (data.parent_id === null) {
      updateData.parent_id = null;
    } else {
      const parentFolder = await prisma.folders.findFirst({
        where: {
          data_id: data.parent_id,
          user_id: userId,
          deleted_at: null,
        },
        select: {
          id: true,
        },
      });

      if (!parentFolder) {
        throw new Error("Parent folder not found");
      }

      updateData.parent_id = parentFolder.id;
    }
  }

  const folder = await prisma.folders.update({
    where: { id: existingFolder.id },
    data: updateData,
    include: {
      users: {
        select: {
          id: true,
          display_name: true,
        },
      },
      parent: {
        select: {
          id: true,
          title: true,
          color: true,
        },
      },
      _count: {
        select: {
          bookmarks: true,
          children: true,
        },
      },
    },
  });

  return decryptFolder(folder);
}

export async function deleteFolder(userId: number, dataId: string) {
  const existingFolder = await prisma.folders.findFirst({
    where: {
      data_id: dataId,
      user_id: userId,
    },
    include: {
      _count: {
        select: {
          children: true,
          bookmarks: true,
        },
      },
    },
  });

  if (!existingFolder) {
    throw new Error("Folder not found or access denied");
  }

  const folder = await prisma.folders.update({
    where: { id: existingFolder.id },
    data: {
      deleted_at: new Date(),
    },
  });

  return decryptFolder(folder);
}

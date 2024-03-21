import { prisma } from "./_client";

export default class Folder {
  static exists(folderId: string) {
    return prisma.folder.findUniqueOrThrow({
      where: { id: folderId },
    });
  }

  static getFolders(id: string) {
    return prisma.folder.findMany({
      where: { owner_id: id },
    });
  }

  static getFoldersByLevel(id: string, parentFolderId: string | null) {
    return prisma.folder.findMany({
      where: { owner_id: id, folder_id: parentFolderId },
    });
  }

  static createFolder(
    title: string,
    owner_id: string,
    folder_id: string | null = null
  ) {
    return prisma.folder.create({
      data: {
        title: title,
        owner_id: owner_id,
        folder_id: folder_id,
      },
    });
  }

  static updateFolder(folderId: string, title: string) {
    return prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        title: title,
      },
    });
  }

  static deleteFolder(folderId: string) {
    return prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
  }

  static moveFolder(id: string, folderId: string | null) {
    return prisma.folder.update({
      where: {
        id: id,
      },
      data: {
        folder_id: folderId,
      },
    });
  }
}

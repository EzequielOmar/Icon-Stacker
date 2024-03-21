import { prisma } from "./_client";

export default class Bookmark {
  static getBookmarks(id: string, parentFolderId: string | null) {
    return prisma.bookmark.findMany({
      where: { owner_id: id, folder_id: parentFolderId },
    });
  }

  static createBookmark(
    url: string,
    owner_id: string,
    folder_id = null,
    picture = null,
    title = null
  ) {
    return prisma.bookmark.create({
      data: {
        url: url,
        owner_id: owner_id,
        folder_id: folder_id,
        picture: picture,
        title: title,
      },
    });
  }

  static updateBookmark(
    bookmarkId: string,
    title: string,
    picture: string | null
  ) {
    return prisma.bookmark.update({
      where: {
        id: bookmarkId,
      },
      data: {
        title: title,
        picture: picture,
      },
    });
  }

  static deleteBookmark(bookmarkId: string) {
    return prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
  }

  static moveBookmark(id: string, folderId: string | null) {
    return prisma.bookmark.update({
      where: {
        id: id,
      },
      data: {
        folder_id: folderId,
      },
    });
  }
}

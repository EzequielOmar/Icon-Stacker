import { prisma } from "./_client";

export default class Bookmark {
  static getBookmarks(id: string) {
    return prisma.bookmark.findMany({
      where: { ownerId: id },
    });
  }

  static createBookmark(url: string, ownerId: string) {
    return prisma.bookmark.create({
      data: {
        url: url,
        ownerId: ownerId,
      },
    });
  }
}

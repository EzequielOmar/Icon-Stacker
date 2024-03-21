import { privateProcedure, router } from "../trpc";
import Bookmark from "../db/Bookmark";
import { UrlValidator, object } from "@/utils/validators";
import { z } from "zod";
import Folder from "../db/Folder";

async function checkUrlAndGetData(
  url: string
): Promise<{ title: string | null; faviconUrl: string | null }> {
  const response = await fetch(url).catch(() => {
    throw new Error("Invalid URL");
  });
  if (response.status >= 500) {
    throw new Error("Page is offline");
  }
  const html = await response.text();
  const titleRegex = /<title>(.*?)<\/title>/i;
  const titleMatch = titleRegex.exec(html);
  const title = titleMatch ? titleMatch[1] : null;
  const regex =
    /<link.*?rel=["'](?:shortcut )?icon["'].*?href=["'](.*?)["'].*?>/gi;
  const match = regex.exec(html);
  if (match) {
    let faviconUrl = match[1];
    if (!faviconUrl.startsWith("http")) {
      const baseUrl = new URL(url);
      faviconUrl = `${baseUrl.protocol}//${baseUrl.hostname}${faviconUrl}`;
    }
    return { title, faviconUrl };
  }
  return { title, faviconUrl: null };
}

export const bookmarkRouter = router({
  allIconsByLevel: privateProcedure
    .input(
      z.object({
        parentFolderId: z.string().nullable(),
      })
    )
    .query(async (opts) => {
      const { parentFolderId } = opts.input;
      const { id } = opts.ctx.user;
      try {
        if (parentFolderId !== null) await Folder.exists(parentFolderId);
        const bookmarks = await Bookmark.getBookmarks(id, parentFolderId);
        const folders = await Folder.getFoldersByLevel(id, parentFolderId);
        return [...bookmarks, ...folders];
      } catch (error) {
        throw error;
      }
    }),
  newBookmark: privateProcedure
    .input(object({ url: UrlValidator, folder_id: z.string().nullable() }))
    .use(async (opts) => {
      const { title, faviconUrl } = await checkUrlAndGetData(opts.input.url);
      if (faviconUrl) opts.input.picture = faviconUrl;
      if (title) opts.input.title = title;
      return opts.next();
    })
    .mutation(async (opts) => {
      const { url, folder_id, picture, title } = opts.input;
      const { id } = opts.ctx.user;
      try {
        const bookmark = await Bookmark.createBookmark(
          url,
          id,
          folder_id,
          picture,
          title
        );
        return bookmark;
      } catch (error) {
        throw error;
      }
    }),
  updateBookmark: privateProcedure
    .input(
      z.object({
        bookmarkId: z.string().min(1),
        title: z.string().min(1),
        picture: z.string().min(1).nullable(),
      })
    )
    .mutation(async (opts) => {
      const { bookmarkId, title, picture } = opts.input;
      try {
        const bookmark = await Bookmark.updateBookmark(bookmarkId, title, picture);
        return bookmark;
      } catch (error) {
        throw error;
      }
    }),
  deleteBookmark: privateProcedure
    .input(
      z.object({
        bookmarkId: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { bookmarkId } = opts.input;
      try {
        const bookmark = await Bookmark.deleteBookmark(bookmarkId);
        return bookmark;
      } catch (error) {
        throw error;
      }
    }),
  moveBookmark: privateProcedure
    .input(
      z.object({
        bookmarkId: z.string().min(1),
        folder_id: z.string().min(1).nullable(),
      })
    )
    .mutation(async (opts) => {
      const { bookmarkId, folder_id } = opts.input;
      try {
        const bookmark = await Bookmark.moveBookmark(bookmarkId, folder_id);
        return bookmark;
      } catch (error) {
        throw error;
      }
    }),
});

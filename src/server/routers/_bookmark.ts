import { privateProcedure, router } from "../trpc";
import Bookmark from "../db/Bookmark";
import { UrlValidator, object } from "@/utils/validators";

export const bookmarkRouter = router({
  allBookmarks: privateProcedure.query(async (opts) => {
    const { id } = opts.ctx.user;
    try {
      const bookmarks = await Bookmark.getBookmarks(id);
      return bookmarks;
    } catch (error) {
      throw error;
    }
  }),
  newBookmark: privateProcedure
    .input(object({ url: UrlValidator }))
    .mutation(async (opts) => {
      const { url } = opts.input;
      const { id } = opts.ctx.user;
      try {
        const bookmark = await Bookmark.createBookmark(url, id);
        return bookmark;
      } catch (error) {
        throw error;
      }
    }),
});

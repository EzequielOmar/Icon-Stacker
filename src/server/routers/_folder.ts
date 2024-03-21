import { privateProcedure, router } from "../trpc";
import Folder from "../db/Folder";
import { z } from "zod";

export const folderRouter = router({
  allFolders: privateProcedure.query(async (opts) => {
    const { id } = opts.ctx.user;
    try {
      const folders = await Folder.getFolders(id);
      return folders;
    } catch (error) {
      throw error;
    }
  }),
  newFolder: privateProcedure
    .input(
      z.object({
        title: z.string().min(1),
        folder_id: z.string().nullable(),
      })
    )
    .mutation(async (opts) => {
      const { title, folder_id } = opts.input;
      const { id } = opts.ctx.user;
      try {
        const folder = await Folder.createFolder(title, id, folder_id);
        return folder;
      } catch (error) {
        throw error;
      }
    }),
  updateFolder: privateProcedure
    .input(
      z.object({
        folderId: z.string().min(1),
        title: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { folderId, title } = opts.input;
      try {
        const folder = await Folder.updateFolder(folderId, title);
        return folder;
      } catch (error) {
        throw error;
      }
    }),
  deleteFolder: privateProcedure
    .input(
      z.object({
        folderId: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { folderId } = opts.input;
      try {
        const folder = await Folder.deleteFolder(folderId);
        return folder;
      } catch (error) {
        throw error;
      }
    }),
  moveFolder: privateProcedure
    .input(
      z.object({
        id: z.string().min(1),
        folder_id: z.string().min(1).nullable(),
      })
    )
    .mutation(async (opts) => {
      const { id, folder_id } = opts.input;
      console.log(id);
      console.log(folder_id);
      try {
        const folder = await Folder.moveFolder(id, folder_id);
        return folder;
      } catch (error) {
        console.log('tito')
        throw error;
      }
    }),
});

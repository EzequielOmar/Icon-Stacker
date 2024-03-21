import { forwardRef, useState } from "react";
import styles from "./GridIcon.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  IconDefinition,
  faFolderOpen,
  faGlobe,
  faPencil,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import trpc from "@/utils/trpc";
import IconDropdown from "../IconDropdown";

interface GridIconProps {
  allIconsQuery: any;
  allFoldersQuery: any;
  bookmark: any;
  hasDragged: boolean;
}

const GridIcon = forwardRef<HTMLDivElement, GridIconProps>(
  ({ allIconsQuery, allFoldersQuery, bookmark, hasDragged }: any, ref) => {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(bookmark.title);
    const [isActionsVisible, setIsActionsVisible] = useState(false);

    const updateBookmark = trpc.updateBookmark.useMutation();
    const updateFolder = trpc.updateFolder.useMutation();
    const deleteBookmark = trpc.deleteBookmark.useMutation();
    const deleteFolder = trpc.deleteFolder.useMutation();

    const handleItemClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (!hasDragged)
        if (bookmark.url) window.open(bookmark.url, "_blank");
        else router.push(`/home?folderId=${bookmark.id}`);
    };

    const handleTitleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setIsEditing(true);
    };

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
    };

    const handleToggleActions = () => {
      setIsActionsVisible(!isActionsVisible);
    };

    const handleTitleSave = async () => {
      setIsEditing(false);
      if (bookmark.url) {
        await updateBookmark.mutateAsync({
          bookmarkId: bookmark.id,
          title: title,
          picture: bookmark.picture,
        });
        allIconsQuery.refetch();
      } else {
        await updateFolder.mutateAsync({
          folderId: bookmark.id,
          title: title,
        });
        allFoldersQuery.refetch();
      }
    };

    const handleRemove = async () => {
      if (bookmark.url) {
        await deleteBookmark.mutateAsync({
          bookmarkId: bookmark.id,
        });
      } else {
        await deleteFolder.mutateAsync({
          folderId: bookmark.id,
        });
      }
      allIconsQuery.refetch();
      allFoldersQuery.refetch();
      setIsActionsVisible(false);
    };

    const handleIconSelect = async (icon: any) => {
      setIsEditing(false);
      if (bookmark.url) console.log(icon);
    };

    return (
      <div className={styles.container} ref={ref}>
        <a className={styles.link} onClick={handleItemClick}>
          {bookmark.url ? (
            bookmark.picture && bookmark.picture.includes("http") ? (
              <img
                src={bookmark.picture}
                alt="Bookmark Icon"
                draggable={false}
              />
            ) : (
              <FontAwesomeIcon icon={faGlobe} size="2xl" />
            )
          ) : (
            <FontAwesomeIcon icon={faFolderOpen} size="2xl" />
          )}
        </a>
        {isEditing ? (
          <input
            className={styles.title}
            type="text"
            value={title || ""}
            onChange={handleTitleChange}
            onBlur={handleTitleSave}
          />
        ) : (
          <div className={styles.title} onClick={handleTitleClick}>
            {title || "none"}
          </div>
        )}
        <div className={styles.actionsToggle} onClick={handleToggleActions}>
          <FontAwesomeIcon icon={faPencil} />
        </div>
        {isActionsVisible && (
          <div className={styles.actionsContainer}>
            <button className={styles.actionButton} onClick={handleRemove}>
              <FontAwesomeIcon icon={faTrash} /> Remove
            </button>
            {bookmark.url && <IconDropdown onSelect={handleIconSelect} />}
          </div>
        )}
      </div>
    );
  }
);

export default GridIcon;

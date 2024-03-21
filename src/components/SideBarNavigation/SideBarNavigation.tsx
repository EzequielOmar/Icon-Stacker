import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "./SideBarNavigation.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";

interface SideBarNavigationProps {
  allFoldersQuery: any;
}

const SideBarNavigation: React.FC<SideBarNavigationProps> = ({
  allFoldersQuery,
}) => {
  const router = useRouter();
  const [folders, setFolders] = useState<any[]>([]);
  const [isSidebarVisible, setIsSidebarVisible] = useState<boolean>(false);

  useEffect(() => {
    if (allFoldersQuery.data) {
      const nestedFolders = organizeFolders(allFoldersQuery.data);
      setFolders(nestedFolders);
    }
  }, [allFoldersQuery.data]);

  const navigateToFolder = (folderId: any) => {
    router.push(`/home?folderId=${folderId}`);
  };

  const navigateToRoot = () => {
    router.push(`/home`);
  };

  const toggleSidebar = () => {
    setIsSidebarVisible(!isSidebarVisible);
  };

  const organizeFolders = (foldersData: any[]) => {
    const nestedFolders: any[] = [];
    const folderMap = new Map<string, any>();
    for (const folder of foldersData) {
      folderMap.set(folder.id, { ...folder, child_folders: [] });
    }
    for (const folder of foldersData) {
      if (folder.folder_id) {
        const parentFolder = folderMap.get(folder.folder_id);
        if (parentFolder) {
          parentFolder.child_folders.push(folderMap.get(folder.id));
        }
      } else {
        nestedFolders.push(folderMap.get(folder.id));
      }
    }
    return nestedFolders;
  };

  const renderFolders = (folders: any[]) => {
    const toggleFolder = (folderId: string) => {
      const folder = document.getElementById(`folder-${folderId}`);
      if (folder) {
        folder.classList.toggle(styles.open);
      }
    };

    return (
      <ul>
        {folders.map((folder: any) => (
          <li key={folder.id}>
            <div className={styles.folder}>
              <span
                className={styles.folderName}
                onClick={() => navigateToFolder(folder.id)}
              >
                {folder.title}
              </span>
              {folder.child_folders.length > 0 && (
                <span
                  className={styles.toggleButton}
                  onClick={() => toggleFolder(folder.id)}
                >
                  {folder.open ? "▼" : "▶"}
                </span>
              )}
            </div>
            {folder.child_folders.length > 0 && (
              <div className={styles.childFolders} id={`folder-${folder.id}`}>
                {renderFolders(folder.child_folders)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      {isSidebarVisible && (
        <div
          className={`${styles.sidebar} ${
            isSidebarVisible ? "" : styles.hidden
          }`}
        >
          <ul>
            <li>
              <div className={styles.folder}>
                <span
                  className={styles.folderName}
                  onClick={() => navigateToRoot()}
                >
                  Root
                </span>
              </div>
              <div className={styles.childFolders}>
                {renderFolders(folders)}
              </div>
            </li>
          </ul>
        </div>
      )}
      <span className={styles.toggleButtonContainer} onClick={toggleSidebar}>
        <FontAwesomeIcon
          icon={isSidebarVisible ? faAnglesLeft : faAnglesRight}
        />
      </span>
    </>
  );
};

export default SideBarNavigation;

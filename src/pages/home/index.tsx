import trpc from "@/utils/trpc";
import { signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import styles from "./Home.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useRedirectUnauthenticated } from "@/hooks/useRedirect";
import BookmarkUrlInput from "@/components/BookmarkUrlInput";
import GridPanel from "@/components/GridPanel";
import FolderInput from "@/components/FolderInput";
import SideBarNavigation from "@/components/SideBarNavigation";
import { useRouter } from "next/router";
import FileUpload from "@/components/FileUpload";

export default function Home() {
  useRedirectUnauthenticated("/signin");
  const router = useRouter();
  const [folderId, setFolderId] = useState<string | null>(null);
  const allIconsQuery = trpc.allIconsByLevel.useQuery({
    parentFolderId: folderId || null,
  });
  const foldersQuery = trpc.allFolders.useQuery();

  useEffect(() => {
    setFolderId(router.query.folderId as string);
  }, [router.query.folderId]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (allIconsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (allIconsQuery.isError) {
    return <div>Error!</div>;
  }

  return (
    <div className={styles.main}>
      <BookmarkUrlInput allIconsQuery={allIconsQuery} />
      <FolderInput
        allIconsQuery={allIconsQuery}
        allFoldersQuery={foldersQuery}
      />
      <FileUpload />

      <div className={styles.container}>
        <SideBarNavigation allFoldersQuery={foldersQuery} />

        {allIconsQuery.data?.length ? (
          <GridPanel allIconsQuery={allIconsQuery}  allFoldersQuery={foldersQuery}/>
        ) : (
          "no data"
        )}
      </div>

      <div className={styles.actions}>
        <button>
          <FontAwesomeIcon icon={faGear} size="2xl" />
        </button>
        <button>
          <FontAwesomeIcon icon={faUser} size="2xl" />
        </button>
        <button onClick={handleLogout}>
          <FontAwesomeIcon icon={faArrowRightFromBracket} size="2xl" />
        </button>
      </div>
    </div>
  );
}

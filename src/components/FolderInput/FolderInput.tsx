import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faPlus } from "@fortawesome/free-solid-svg-icons";
import trpc from "@/utils/trpc";
import { useRouter } from "next/router";

interface BookmarkUrlInputProps {
  allIconsQuery: any;
  allFoldersQuery: any;
}

const FolderInput: React.FC<BookmarkUrlInputProps> = ({
  allIconsQuery,
  allFoldersQuery,
}) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const mutation = trpc.newFolder.useMutation({
    onSuccess: () => {
      setInputValue("");
      setError("");
      toggleEditing();
      allIconsQuery.refetch();
      allFoldersQuery.refetch();
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setInputValue("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleAddClick = () => {
    const folder_id: string | null = Array.isArray(router.query.folderId)
      ? router.query.folderId[0]
      : router.query.folderId || null;
    mutation.mutate({ title: inputValue, folder_id: folder_id });
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            autoFocus
          />
          <button onClick={handleAddClick}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <button onClick={toggleEditing}>
          <FontAwesomeIcon icon={faFolder} />
        </button>
      )}
    </div>
  );
};

export default FolderInput;

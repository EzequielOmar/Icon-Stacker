import { useState, FormEvent } from "react";
import trpc from "@/utils/trpc";
import { useRouter } from "next/router";

interface BookmarkUrlInputProps {
  allIconsQuery: any;
}

const BookmarkUrlInput: React.FC<BookmarkUrlInputProps> = ({
  allIconsQuery,
}) => {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const mutation = trpc.newBookmark.useMutation({
    onSuccess: () => {
      setUrl("");
      setError("");
      allIconsQuery.refetch();
    },
    onError: (error: any) => {
      setError(error.message);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const folder_id: string | null = Array.isArray(router.query.folderId)
      ? router.query.folderId[0]
      : router.query.folderId || null;
    mutation.mutate({ url, folder_id: folder_id });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button type="submit">Add Bookmark</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};

export default BookmarkUrlInput;

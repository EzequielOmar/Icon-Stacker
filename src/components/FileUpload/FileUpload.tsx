import React, { useState } from "react";
import styles from "./FileUpload.module.scss";

const MAX_FILE_SIZE_MB = 5;

interface FileUploadInputProps {
  onFileUpload: any;
}

const FileUpload: React.FC = ({}) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === "text/html") {
        if (selectedFile.size / (1024 * 1024) <= MAX_FILE_SIZE_MB) {
          setFile(selectedFile);
          setError(null);
        } else {
          setError(`File size exceeds ${MAX_FILE_SIZE_MB} MB.`);
          setFile(null);
        }
      } else {
        setError("Only HTML files are allowed.");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (file) {
      setIsLoading(true);
      try {
        console.log(file)
        //await uploadProfileImage(file);
        setIsLoading(false);
        setFile(null);
      } catch (error) {
        console.log(error);
        setError("Error uploading file. Please try again.");
        setIsLoading(false);
      }
    } else {
      setError("No file selected.");
    }
  };

  const uploadProfileImage = async (file: File) => {
    const body = new FormData();

    body.set("image", file);

    const response = await fetch("/api/import", {
      method: "POST",
      body,
    });

    if (!response.ok) {
      throw new Error("Error uploading profile image");
    }

    const result: any = await response.json();
    console.log(response);
    if (!result) throw new Error("Error uploading profile image");
    return result;
  };

  return (
    <div className={styles.container}>
      <input
        type="file"
        accept=".html"
        className={styles.input}
        onChange={handleFileChange}
        disabled={isLoading}
      />
      <button onClick={handleUpload} disabled={!file || isLoading}>
        Upload
      </button>
      {error && <div className={styles.error}>{error}</div>}
      {isLoading && <div className={styles.loading}>Uploading...</div>}
      {file && !isLoading && (
        <div className={styles.success}>File selected: {file.name}</div>
      )}
    </div>
  );
};

export default FileUpload;

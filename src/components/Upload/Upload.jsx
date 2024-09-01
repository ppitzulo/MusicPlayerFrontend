import { useState, useRef } from "react";
import "./Upload.css";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function getCSRFToken() {
  let csrfToken = null;
  const cookies = document.cookie.split(';');

  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith("csrftoken=")) {
      csrfToken = cookie.substring('csrftoken='.length);
      break;
    }
  }

  return csrfToken;
}

const CSRFToken = getCSRFToken();

const Upload = () => {
    const [uploading, setUploading] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const fileInputRef = useRef(null);

    const handleFileUpload = (event) => {
        setUploading(true);
        const files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        fetch(backendURL + "/api/upload/", {
            method: "POST",
            headers: {
                "X-CSRFToken": CSRFToken,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then(() => {
                setUploading(false);
            })
            .catch((error) => {
                setUploading(false);
                console.error("Upload error:", error);
            });
    };

    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    return (
        <>
            <input
                type="file"
                id="file-upload"
                multiple
                onChange={handleFileUpload}
                ref={fileInputRef}
                style={{ display: 'none' }}
            />
            <div className="upload-container">
                <div className="upload">
                    {!uploading && (
                        <button type="button" onClick={triggerFileInput}>
                            <FontAwesomeIcon className="uploadIcon" icon={faCloudUploadAlt} />
                            Upload Files
                        </button>
                    )}
                    {uploading && (
                        <div className="spinner-container">
                            <span className="spinner"></span>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Upload;

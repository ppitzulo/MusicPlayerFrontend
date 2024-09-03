import { useState, useEffect, useRef } from "react";
import "./Upload.css";
import { faCloudUploadAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


// Helper function to get CSRF token from cookies
const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

const Upload = () => {
    const [CSRFToken, setCSRFToken] = useState("");
    const [uploading, setUploading] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL;
    const fileInputRef = useRef(null);

    useEffect(() => {
        fetch(backendURL + "/api/csrf-token", {
            credentials: "include",
        })
            .then((response) => response.json())
            .then((data) => {
                console.log("CSRF token:", data);
                setCSRFToken(data.csrfToken);
            });
    }, [backendURL]);

    const handleFileUpload = (event) => {
        setUploading(true);
        const files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }
        console.log("csrf token:", CSRFToken);
        fetch(backendURL + "/api/upload/", {
            credentials: "include",
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

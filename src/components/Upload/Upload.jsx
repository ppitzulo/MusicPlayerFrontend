import { React, useState, useEffect } from "react";
import "./Upload.css";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Upload = () => {
    const [CSRFToken, setCSRFToken] = useState("");
    const [uploading, setUploading] = useState(false);
    const backendURL = import.meta.env.VITE_BACKEND_URL

    useEffect(() => {
        fetch(backendURL + "/api/csrf-token")
            .then((response) => response.json())
            .then((data) => {
                setCSRFToken(data);
            });
    }, []);

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
                console.error("Upload erorr:", error);
            });
    };


    return (
        <>
            <input type="file" id="file-upload" multiple onChange={handleFileUpload} />
            {!uploading && <label htmlFor="file-upload" className="custom-file-upload header-text"> <FontAwesomeIcon className="uploadIcon" icon={faArrowUpFromBracket} /> </label>}
            {uploading && <div className="spinner-container"><span className="spinner"></span></div>}
        </>
    );
};

export default Upload;

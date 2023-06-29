import { React, useState, useEffect } from "react";
import "./Upload.css";


const Upload = () => {
    const [CSRFToken, setCSRFToken] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetch("http://192.168.0.125:8000/api/csrf-token")
        .then((response) => response.json())
        .then((data) => {
            setCSRFToken(data);
        });
    }, []);

    const handleFileUpload = (event) => {
        handleSetUploading(true);
        const files = event.target.files;
        const formData = new FormData();

        for (let i = 0; i < files.length; i++) {
            formData.append("files", files[i]);
        }

        fetch("http://192.168.0.125:8000/api/upload/", {
            method: "POST",
            headers: {
                "X-CSRFToken": CSRFToken,
            },
            body: formData,
        })
        .then((response) => response.json())
        .then(() => {
            handleSetUploading(false);
        })
        .catch((error) => {
            handleSetUploading(false);
            console.error("Upload erorr:", error);
        });
    };

    return (
        <>
            <input type="file" id="file-upload" multiple onChange={handleFileUpload} />
            {!uploading && <label htmlFor="file-upload" className="custom-file-upload header-text"> Upload </label>}
            {uploading && <div className="spinner-container"><span className="spinner"></span></div>}
        </>
  );
};

export default Upload;

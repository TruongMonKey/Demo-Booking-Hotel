import React, { useState } from "react";
import axios from "axios";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const ImageUploader = (hotelId) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFiles([...e.target.files]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });
  };

  return (
    <div>
      <input type="file" multiple accept="image/*" onChange={handleFileChange} />
      <Button icon={<UploadOutlined />} onClick={handleUpload}>Upload</Button>

      <h3>Uploaded Images</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {uploadedUrls.map((url, index) => (
          <img key={index} src={url} alt={`Uploaded ${index}`} style={{ width: "150px", borderRadius: "8px" }} />
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;

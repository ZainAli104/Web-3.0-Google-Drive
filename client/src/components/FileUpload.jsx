import { useState } from "react";
import axios from "axios";

import "./FileUpload.css";

function FileUpload({ contract, provider, account }) {
  // const [urlArr, setUrlArr] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No image selected");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (file) {
        setIsLoading(true);
        try {
          const formData = new FormData();
          formData.append("file", file);

          const resFile = await axios({
            method: "post",
            url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
            data: formData,
            headers: {
              pinata_api_key: "0e7e8d1f5775b97af452",
              pinata_secret_api_key: "502746b0ea2e4f184ed585d903aaa7ced31902fb9d76dff8d7de65e89bd18e7a",
              "Content-Type": "multipart/form-data",
            },
          });

          const ImgHash = `ipfs://${resFile.data.IpfsHash}`;
          const signer = contract.connect(provider.getSigner());
          signer.add(account, ImgHash);

          //setUrlArr((prev) => [...prev, ImgHash]);

          //Take a look at your Pinata Pinned section, you will see a new file added to you list.
        } catch (error) {
          alert("Error sending File to IPFS");
          console.log(error);
        }
      }

      console.log("Successfully Uploaded");
      setIsLoading(false);
      setFileName("No image selected");
      setFile(null); //to again disable the upload button after upload
    } catch (error) {
      console.log(error.message); //this mostly occurse when net is not working
    }
  };
  const retrieveFile = (e) => {
    const data = e.target.files[0];
    console.log(data);

    const reader = new window.FileReader();

    reader.readAsArrayBuffer(data);
    reader.onloadend = () => {
      setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };

  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          {/*turn around for avoding choose file */}
          Choose Image
        </label>
        <input
          disabled={!account} //disabling button when metamask account is not connected
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image: {fileName}</span>
        {/* choose file */}
        {!isLoading ? (
          <button type="submit" disabled={!file} className="upload">
            Upload file
          </button>
        ) : (
          <button className="upload">
            Uploading...
          </button>
        )}
      </form>
    </div>
  );
}

export default FileUpload;

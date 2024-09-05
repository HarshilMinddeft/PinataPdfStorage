import { useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [ipfsData, setIpfsData] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadStatus('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json', 
        }
      });

      if (response.ok) {
        const data = await response.json();
        setIpfsData(data);  // Store the IPFS data in state
        setUploadStatus(`File uploaded successfully!`);
      } else {
        throw new Error('Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');

    }
  };

  return (
    <div className="App">
      <center>
      <h1>Upload PDF to Pinata</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      <p>{uploadStatus}</p>
      {ipfsData && (
          <div>
            <h3>IPFS Details:</h3>
            <p><strong>IPFS Hash:</strong> {ipfsData.IpfsHash}</p>
            <p><strong>Pin Size:</strong> {ipfsData.PinSize} bytes</p>
            <p><strong>Timestamp:</strong> {new Date(ipfsData.Timestamp).toLocaleString()}</p>
            <p><strong>File Link:</strong> <a href={ipfsData.url} target="_blank" rel="noopener noreferrer">View File</a></p>
          </div>
        )}
      </center>
    </div>
  );
}

export default App;

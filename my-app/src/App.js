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
      <h1 className='text-4xl pt-10 pb-10'>Upload PDF to Pinata</h1>
      <form onSubmit={handleSubmit}>
        <input className=' flex items-start pb-2 pt-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400' type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className=' flex items-start mt-9 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' type="submit">Upload</button>
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

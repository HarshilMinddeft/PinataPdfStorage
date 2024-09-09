import { useState } from 'react';
import './App.css';
import Erc721 from './artifacts/contracts/Erc721.sol/FinalNft.json'
import { ethers } from 'ethers';

function App() {
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [tokenId, setTokenId] = useState("");
  const [errors,setErrors] = useState("")
  const [pdflink,setPdflink] =useState("")
  const [ipfsData, setIpfsData] = useState(null);
  const contractAddress = "0x78b4cEA59aF9A703CA98747B1b9dEcc6c937FF0d" //Arbitrum
  const account1="0x5365d0B95AF4a11e424957419B33F61b3c551B36"
  const ACCESS_TOKEN = "w819U9v_bB8G9l0BphRNeXdzT_LkE7k358Znt2JRkoFFzRCvswy7rdBHMs8IGURs"

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

    const handelTokenIdChange = (e) => {
    setTokenId(e.target.value);
  };

  const handlenftFetch = async (event)=>{
    event.preventDefault();
    try {
      
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    console.log("signerAddress",address)
    const nftTokenId = new ethers.Contract(
      contractAddress,
      Erc721.abi,
      signer
    );

    const tokenURI = await nftTokenId.tokenURI(tokenId);
      console.log("Url===>",tokenURI);

      const response = await fetch(tokenURI);
      const metadata = await response.json();
      console.log("Metadata fetched from IPFS:", metadata);

    // Extract the name (which holds the second IPFS hash)
     const ipfsName = metadata.name;
     console.log("IPFS Name (hash):", ipfsName);

    setPdflink(`https://brown-leading-scallop-142.mypinata.cloud/ipfs/${ipfsName}?pinataGatewayToken=${ACCESS_TOKEN}`)

      }catch (error) {
      console.error(error)

      if (error.message.includes("Caller is not the owner of the token")){
        setErrors("You Dont Own this Nft")
      }else if(error.message.includes("ERC721NonexistentToken")){
        setErrors("Invalid ID")
      }else{
        setErrors("Something went wrong")
      }
    }
  }

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
      }
    );

      if (response.ok) {
        const data = await response.json();
        setIpfsData(data);  // Store the IPFS data in state
        setUploadStatus(`File uploaded successfully!`);

        const metadata = {
          "description": "PrivetData",
          "external_url": "https://openseacreatures.io/3",
          "image": "https://brown-leading-scallop-142.mypinata.cloud/ipfs/QmQmGb9DSyyHaWBiaTV8ZM2JxpTtf7dx5bnDsBp94XhA3H?pinataGatewayToken=w819U9v_bB8G9l0BphRNeXdzT_LkE7k358Znt2JRkoFFzRCvswy7rdBHMs8IGURs",
          "name": data.IpfsHash,
          "attributes": [
            {
              "trait_type": "PDF",
              "value": "Doc"
            },
          ]
        };

        const jsonResponse = await fetch('http://localhost:5000/uploadJson', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(metadata)
        });

        const jsonData = await jsonResponse.json();
        console.log("JSON Metadata uploaded:", jsonData);
        console.log("IpfsHash",jsonData.IpfsHash)

        const metadatanft = `https://ipfs.io/ipfs/${jsonData.IpfsHash}` // link of pinata where we are storing hash

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        console.log("signerAddress",address)

        const IpfsHashNft = new ethers.Contract(
          contractAddress,
          Erc721.abi,
          signer
        );
        
        console.log("Account1==>",account1)
        console.log("MetadataNft==>",metadatanft);

        const transaction =
          await IpfsHashNft.safeMint(
            account1,
            metadatanft
          );

        const receipt = await transaction.wait();
        console.log("Transaction receipt:", receipt);
        const tokenId = receipt.events.find(event => event.event === 'Transfer').args.tokenId.toString();
        setUploadStatus(`NFT minted successfull Your Token ID:=> ${tokenId}`);
  

      } else {
        throw new Error('Upload failed.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  return (
    <>
    <div className="App">
      <center>
      <marquee><h1 className='text-4xl mt-2 mb-2 text-white'>Demo Dapp website</h1></marquee>
      <h1 className='text-4xl pt-10 pb-10 text-white'>Upload PDF to Pinata</h1>
      <form onSubmit={handleSubmit}>
        <input className=' flex items-start pb-2 pt-2 text-lg text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-white focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400' type="file" accept="application/pdf" onChange={handleFileChange} />
        <button className=' flex items-start mt-9 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' type="submit">Upload</button>
      </form>
      <p className='text-3xl text-white'> {uploadStatus}</p>
      {ipfsData && (
          <div>
            <h2 className='text-2xl pt-3 text-white'>IPFS Details:</h2>
            <p className='text-2xl pt-3 text-white'><strong>IPFS Hash:</strong> {ipfsData.IpfsHash}</p>
            <p className='text-2xl pt-3 text-white'><strong>Pin Size:</strong> {ipfsData.PinSize} bytes</p>
            <p className='text-2xl pt-3 text-white'><strong>Timestamp:</strong> {new Date(ipfsData.Timestamp).toLocaleString()}</p>
            <p className='text-2xl pt-3 text-white'><strong>File Link:</strong> <a href={ipfsData.url} target="_blank" rel="noopener noreferrer">View File</a></p>
          </div>
        )}
      <form className='max-w-sm mx-auto' onSubmit={handlenftFetch}>
        <div className=" mt-10 ">
              <input
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-6 p-2.5"
                type="number"
                placeholder="TokenId"
                min={0}
                value={tokenId}
                onChange={handelTokenIdChange}
              />
            </div>
            <button className=' flex items-start mt-9 mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800' type="submit">FetchPDF</button>
            </form>
          <div>
           {pdflink && (
            <p className='text-white text-3xl mt-8'>
              <a href={pdflink} target="_blank" rel="noopener noreferrer">
              View Document
        </a>
        </p>
      )}
        <h1 className='text-white text-3xl mt-8'>{errors}</h1>
      </div>
      </center>
    </div>
    </>
  );
}

export default App;

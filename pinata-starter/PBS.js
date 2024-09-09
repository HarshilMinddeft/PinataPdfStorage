const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const port = 5000;

app.use(cors({
    origin: 'http://localhost:3000',  // Allow requests from your frontend
    methods: ['GET', 'POST'],  // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true  
}));


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },

  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const filePath = path.join(__dirname, 'uploads', req.file.filename);

    let data = new FormData();
    data.append('file', fs.createReadStream(filePath));
    data.append('pinataOptions', '{"cidVersion": 0}');
    data.append('pinataMetadata', `{"name": "${req.file.originalname}"}`);

    const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`,
        ...data.getHeaders()
      }
    });

    // console.log(res.data)
    const fileUrl = `https://brown-leading-scallop-142.mypinata.cloud/ipfs/${response.data.IpfsHash}?pinataGatewayToken=${process.env.ACCESS_TOKEN}`;
    res.json({
        IpfsHash: response.data.IpfsHash,
        PinSize: response.data.PinSize,
        Timestamp: response.data.Timestamp,
         url: fileUrl 
        });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to upload file to Pinata' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

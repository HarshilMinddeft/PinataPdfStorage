const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config()

const pinFileToIPFS = async () => {
  try {
    let data = new FormData()
    data.append('file', fs.createReadStream('./sample.pdf'))
    data.append('pinataOptions', '{"cidVersion": 0}')
    data.append('pinataMetadata', '{"name": "pinnie"}')

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      headers: {
        'Authorization': `Bearer ${process.env.PINATA_JWT}`
      }
    })
    console.log(res.data)
    console.log(`View the file here: https://brown-leading-scallop-142.mypinata.cloud/ipfs/${res.data.IpfsHash}?pinataGatewayToken=${process.env.ACCESS_TOKEN}`)
  } catch (error) {
    console.log(error)
  }
}

pinFileToIPFS()
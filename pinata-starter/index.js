const { PinataSDK } = require("pinata");
const fs = require("fs");
const { Blob } = require("buffer");
require("dotenv").config();

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: "brown-leading-scallop-142.mypinata.cloud"
});

async function upload() {
  try {
    const blob = new Blob([fs.readFileSync("./sample1.pdf")]);
    const file = new File([blob], "sample1.pdf", { type: "application/pdf" });
    const uploadResponse = await pinata.upload.file(file);
    console.log('Upload Response:', uploadResponse);

    // Pin the file using the CID from the upload response
    const pinResponse = await pinata.pinByHash(uploadResponse.IpfsHash);
    console.log('Pin Response:', pinResponse);
  } catch (error) {
    console.log(error);
  }
}

upload();

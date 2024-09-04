const { PinataSDK }  = require("pinata"); 
require("dotenv").config()

const pinata = new PinataSDK({
    pinataJwt: process.env.PINATA_JWT,
    pinataGateway: "brown-leading-scallop-142.mypinata.cloud",
});

async function main() {
  try {
    const data = await pinata.gateways.get("bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq");
    console.log("Fetched Data:", data); 
    
    const fileUrl = `https://${pinata.pinataGateway}/ipfs/bafkreibm6jg3ux5qumhcn2b3flc3tyu6dmlb4xa7u5bf44yegnrjhc4yeq`;
    console.log("File URL:", fileUrl); 
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

main();

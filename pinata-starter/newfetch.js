const  PinataSDK  = require("@pinata/sdk");
const pinata = new PinataSDK({ pinataApiKey: "92806a1f292a8b977ce7", pinataSecretApiKey: "2399f7ddd3c77c341e7f2c8385739e0a5863f2fb37535b1927f5de28958c5b9c" });

async function checkFile() {
  try {
    const response = await pinata.pinList({
      hashContains: "bafybeibykii2oidjd7huy72ljn74rae6nyrlbwqwffj7b7t2jnyhk7soc4"
    });
    console.log(response);
  } catch (error) {
    console.log("Error fetching file:", error);
  }
}

checkFile();

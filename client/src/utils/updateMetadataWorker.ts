import axios from "axios";

onmessage = async function (event) {
  console.log("Received message from the main thread:", event.data);
  const { forceAll } = event.data;

  // Perform some computation
  const updateMetadataResponse = await axios.post(
    `${process.env.REACT_APP_API_URL}/update-metadata`,
    { forceAll },
    { timeout: 20 * 60 * 1000 }
  );

  // Send the result back to the main thread
  postMessage(updateMetadataResponse);
};

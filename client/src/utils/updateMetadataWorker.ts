import axios from "axios";

onmessage = async function (event) {
  console.log('Received message from the main thread:', event.data);
  const { forceAll } = event.data;

  // Perform some computation
  const updateMetadataResponse = await axios.post(`${process.env.REACT_APP_API_URL}/update-metadata`, { forceAll })

  // Send the result back to the main thread
  postMessage(updateMetadataResponse.data);
};
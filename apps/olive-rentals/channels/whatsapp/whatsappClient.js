const axios = require('axios');
const environment = require('../../config/environment');

function createClient(axiosInstance) {
  const client = axiosInstance || axios.create({
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${environment.meta.accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  async function sendMessage(payload) {
    if (!environment.meta.accessToken) {
      throw new Error('WhatsApp access token is not configured');
    }

    if (!environment.meta.phoneNumberId) {
      throw new Error('WhatsApp phone number ID is not configured');
    }

    const url = `https://graph.facebook.com/${environment.meta.graphApiVersion}/${environment.meta.phoneNumberId}/messages`;

    try {
      const response = await client.post(url, payload);
      return response.data;
    } catch (error) {
      const message = error.response?.data || error.message || 'WhatsApp request failed';
      throw new Error(`WhatsApp client error: ${JSON.stringify(message)}`);
    }
  }

  return {
    sendMessage
  };
}

module.exports = {
  createClient
};

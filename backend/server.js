const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/upsert-embedding', async (req, res) => {
    const { pineconeKey, pineconeEnvironment, vectors } = req.body;
  
    try {
      const response = await axios.post(
        `https://${pineconeEnvironment}/vectors/upsert`,
        { vectors },
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': pineconeKey,
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error('Error upserting embedding:', error.response ? error.response.data : error.message);
      res.status(500).json({
        error: 'Error upserting embedding',
        details: error.response ? error.response.data : error.message,
      });
    }
  });
  

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});

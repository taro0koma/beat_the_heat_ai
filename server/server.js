import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { AzureOpenAI } from 'openai'; // OpenAI から AzureOpenAI をインポート
import "@azure/openai/types";

dotenv.config();

const apiKey = process.env.AZURE_OPENAI_API_KEY; 
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; 
const deployment = "gpt-4o"; // デプロイ名
const apiVersion = "2024-11-20";

const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/azure/beattheheat', async (req, res) => {
  try {
    const client = new AzureOpenAI({
      deployment, apiVersion, apiKey, endpoint,
    });

    const role = req.body.role; 
    const content = req.body.content; 

    const response = await client.chat.completions.create({
      model: deployment,
      messages: [{ role: role, content: content }],
    });

    res.status(200).send({
      bot: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`サーバーはポート ${PORT} で稼働中です。`));

//import文-----------------------------------------------------------------------
import dotenv from 'dotenv';
import express, { response } from 'express';
import cors from 'cors';
import { AzureOpenAI } from 'openai';
import "@azure/openai/types";
//--------------------------------------------------------------------------------
dotenv.config();


// access environment variables
const apiKey = process.env.AZURE_OPENAI_API_KEY; 
const endpoint = process.env.AZURE_OPENAI_ENDPOINT; 
const deployment = "gpt-4o"; //デプロイ名
const apiVersion = "2024-11-20";


const app = express();


//テスト用にURLを3つ作った
const allowedOrigins = [
  'https://www.sakubun-otasuke.com',
  'https://azure-react-sakubun-otasuke.vercel.app',
  'https://react-sakubun-otasuke.vercel.app',
]

app.use(cors({
  origin: function (origin,callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else{
      console.error(`CORSのエラーが発生したよ:origin ${origin} not allowed`);
    }
  }
}));
app.use(express.json());


//処理------------------------------------------------------------------------

app.post('/api/beat_the_heat',async (req,res) =>{

  try{
    // console.log(endpoint);
    // console.log('サーバーサイドに入ったよ');
    const client = new AzureOpenAI({
      deployment,apiVersion,apiKey,endpoint
    });
  
    const prompt = req.body.prompt;
    const role = req.body.role;
    // console.log(prompt);
  
  
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: role },
        { role: "user", content: prompt }
      ],
    });
  
    // console.log("Azure-apiの中に入ったよ")
  
    res.status(200).send({
      bot: response.choices[0].message.content
    })
  }catch (error){
    res.status(500).send({ error })
  }
  })
  
  app.get('/api/beat_the_heat',async (req,res) => {
    res.status(200).send({
      message: 'Hello!! beat the heat!!'
    })
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log('サーバーは動いています！ポート：http://localhost:5000'));

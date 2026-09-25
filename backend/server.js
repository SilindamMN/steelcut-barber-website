import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json({limit:'20kb'}));

const shopContext = `You are Steelcut AI, the customer assistant for Steelcut Barber Co.\n\nKnown shop information:\n- Monday-Friday: 09:00-19:00\n- Saturday: 08:00-17:00\n- Sunday: Closed\n- The shop has 7 barbers.\n- Customers can book a service, barber, date and available time through the website.\n- Products include Beard Oil and other grooming products shown on the website.\n- Never invent prices, availability, policies, barber details, or services. If information is not provided, tell the customer to check the website or contact the shop.\n- Keep replies concise, friendly and useful.\n`;

const client = process.env.OPENAI_API_KEY ? new OpenAI({apiKey:process.env.OPENAI_API_KEY}) : null;

app.get('/api/health',(req,res)=>res.json({ok:true,aiConfigured:Boolean(client)}));
app.post('/api/chat',async(req,res)=>{
  const message=String(req.body?.message||'').trim();
  if(!message)return res.status(400).json({error:'Message is required.'});
  if(!client)return res.status(503).json({error:'AI is not configured.'});
  try{
    const response=await client.responses.create({
      model:process.env.OPENAI_MODEL || 'gpt-5.6-mini',
      instructions:shopContext,
      input:message,
      max_output_tokens:250
    });
    res.json({reply:response.output_text});
  }catch(error){
    console.error(error);
    res.status(500).json({error:'Unable to reach the AI service.'});
  }
});

app.listen(port,()=>console.log(`Steelcut AI backend listening on http://localhost:${port}`));

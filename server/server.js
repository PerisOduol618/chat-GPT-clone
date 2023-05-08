import express, { response } from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAI_API_KEY)

const configuration = new Configuration({
    apiKey:process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

// initialize our express app
const app = express();

// allow our server to be called from the front end
app.use(cors());

// allow us to pass json from front end to backend
app.use(express.json());

// Dummy root route
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from codeX',
    })
})

// Allows us to have a payload
app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt; 

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:`${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log(response.data)
        // send the response back to the front end
        res.status(200).send({
            // bot:response.addTrailers.choices[0].text
            bot:response.data.choices[0].text

        })

    } catch (error) {
        console.log(error);
        res.status(500).send({ error })
        
    }
})

// make sure our sever always listens for new requests
app.listen(5000, () => console.log('server is running on port http://localhost:5000'))

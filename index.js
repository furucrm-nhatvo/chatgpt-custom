// 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
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const configuration = new Configuration({
    organization: "org-Hw74F59UFBu7mnHsKx116yFm",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3080
app.post('/',async (req,res) => {
    const {message, model, temperature, tokens} = req.body
    try{
        const response = await openai.createCompletion({
            model,
            prompt: message,
            max_tokens: Number(tokens),
            temperature: Number(temperature),
          });
          res.json({
            message:response.data.choices[0].text
          })

    } catch(e){
        res.json({
            error:e.response.data.error
        })
    }
})
app.get('/models',async (req,res) => {
    try{
        const response = await openai.listEngines()
        res.json({
            models:response.data.data
        })

    } catch(e){
        res.json({
            error:e.response.data.error
        })
    }
})
app.listen(port, ()=>{
    console.log('listening at port',port)
})
const { Configuration, OpenAIApi } = require("openai");
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

const serviceAccount = require('./serviceAccountKey.json');

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();


const configuration = new Configuration({
    organization: "org-Hw74F59UFBu7mnHsKx116yFm",
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);
const app = express()
app.use(bodyParser.json())
app.use(cors())
const port = 3080;

app.post('/openai/completion', async (req, res) => {
    const { message, model, temperature, tokens } = req.body
    try {
        const response = await openai.createCompletion({
            model,
            prompt: message,
            max_tokens: Number(tokens),
            temperature: Number(temperature),
        });
        res.json({
            message: response.data.choices[0].text
        })

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})
app.get('/openai/models', async (req, res) => {
    try {
        const response = await openai.listEngines()
        res.json({
            models: response.data.data
        })

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})
app.post('/db/chats', async (req, res) => {
    const { id, config, chatLog } = req.body
    try {
        const docRef = db.collection('chats').doc(id);
        await docRef.set({ id, config, chatLog });
        res.json({})

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})
app.get('/db/chats', async (req, res) => {
    try {
        let data = []
        const snapshot = await db.collection('chats').get();
        snapshot.forEach((doc) => {
            data.push(doc.data())
        });
        res.json({
            chats: data
        })

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})
app.get('/db/chats/:id', async (req, res) => {
    const {id} = req.params
    try {
        const docRef = db.collection('chats').doc(id);
        const doc = await docRef.get()
        if (!doc.exists) {
            res.json({
                error: 'Chat does not exists'
            })
            return
        }
        res.json({
            chat: doc.data()
        })

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})
app.put('/db/chats/:id', async (req, res) => {
    const {id} = req.params
    const { config, chatLog } = req.body
    try {
        const docRef = db.collection('chats').doc(id);
        await docRef.set({ id, config, chatLog });
        res.json({})

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})
app.delete('/db/chats/:id', async (req, res) => {
    const {id} = req.params
    try {
        const docRef = db.collection('chats').doc(id);
        await docRef.delete();
        res.json({})

    } catch (e) {
        res.json({
            error: e.response.data.error
        })
    }
})


app.listen(port, () => {
    console.log('listening at port', port)
})
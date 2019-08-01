import "dotenv/config";
import express from 'express';
import cors from 'cors'
import getAnalysis from './getAnalysis';


const app = express()
app.use(cors())

const port = 3001

app.get('/get-data', (_, res) => {
  getAnalysis()
    .then(data => res.json({ data }))
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

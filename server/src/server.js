import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import { schemes } from './data/schemes.js'

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.post('/api/schemes/recommend', (req, res) => {
  const { age = 18, state = '', goal = '' } = req.body
  const text = `${goal} ${state}`.toLowerCase()
  const isDairyOrBusiness = /dairy|business|farm|entrepreneur|startup/.test(text)
  const matches = schemes
    .filter((scheme) => Number(age) >= scheme.ageMin)
    .filter((scheme) => isDairyOrBusiness || scheme.categories.includes('entrepreneur'))
    .map((scheme) => ({
      ...scheme,
      whyEligible: `You meet the minimum age requirement and your goal (${goal || 'starting a business'}) aligns with this scheme.`
    }))

  res.json({ profile: { age, state, goal }, schemes: matches })
})

app.listen(port, () => console.log(`API ready at http://localhost:${port}`))

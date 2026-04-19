import express from 'express'
import cors from 'cors'
import { connectDB } from './src/config/db.js'
import accommodationRoutes from './src/routes/accommodationRoutes.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

connectDB()

app.use('/api/accommodations', accommodationRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

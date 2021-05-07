const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const trackerRouter = require('./routers/tracker')

const app = express()
const port = process.env.PORT 

app.use(express.json())
app.use(userRouter)
app.use(trackerRouter)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`)
})


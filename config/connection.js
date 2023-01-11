const mongoose = require('mongoose')

mongoose.set('strictQuery', true)
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
  // useCreateIndex:true
}).then(() => {
  console.log('connection successfull')
}).catch((e) => {
  console.log('no connection')
})

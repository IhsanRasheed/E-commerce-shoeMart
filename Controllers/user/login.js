const userModel = require('../../Model/userModel')
const bcrypt = require('bcrypt')

const loginPage = (req, res) => {
  res.render('user/login', req.query)
}

// User login verification
const userVerfication = async (req, res) => {
  try {
    const inputEmail = req.body.email
    const inputPassword = req.body.password
    const userFind = await userModel.findOne({ email: inputEmail })
    if (userFind) {
      if (userFind.status === true) {
        const hashedCheck = await bcrypt.compare(inputPassword, userFind.password)
        if (hashedCheck === true) {
          req.session.user = userFind._id
          //  console.log(req.session.user)
          res.redirect('/')
        } else {
          res.redirect('/user/login?wrong=Wrong Email or Password')
        }
      } else {
        res.redirect('/user/login?wrong=Your Account is Blocked')
      }
    } else {
      res.redirect('/user/login?wrong=Invalid User')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  loginPage,
  userVerfication

}

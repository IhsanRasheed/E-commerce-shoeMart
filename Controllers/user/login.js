const userModel = require('../../Model/userModel')
const bcrypt = require('bcrypt')

const loginPage = (req, res) => {
  try {
    res.render('user/login', req.query)
  } catch (error) {
    console.log(error)
  }
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
    res.redirect('/404')
  }
}

const logout = async (req, res) => {
  try {
    req.session.destroy()
    res.redirect('/login')
  } catch (error) {
    console.log(error)
    res.redirect('/404')
  }
}

module.exports = {
  loginPage,
  userVerfication,
  logout
}

const adminModel = require('../../Model/adminModel')

const login = (req, res) => {
  res.render('admin/adminLogin', req.query)
}

const adminVerification = async (req, res) => {
  try {
    const email = req.body.email
    const password = req.body.password
    const adminAccount = await adminModel.findOne({ email })
    if (email === adminAccount.email && password === adminAccount.password) {
      res.redirect('/admin/home')
    } else {
      res.redirect('/admin/login?wrong=Password wrong')
    }
  } catch (error) {
    res.redirect('/admin/login?wrong=User not exist')
  }
}

const adminHome = (req, res) => {
  res.render('admin/adminHome.ejs')
}

module.exports = {
  login,
  adminVerification,
  adminHome
}

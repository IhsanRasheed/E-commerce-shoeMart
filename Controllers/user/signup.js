const userModel = require('../../Model/userModel')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')

// Signup Page
const signupPage = (req, res) => {
  if (req.session.tempOTP !== false) {
    req.session.tempOTP = false
  }
  res.render('user/signup')
}

// Register User
let newUserDetails
const registerUser = async (req, res) => {
  const userdata = req.body
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    newUserDetails = await userModel({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: hashedPassword
    })
    const inputEmail = req.body.email
    const inputNumber = req.body.mobile
    const emailCheck = await userModel.findOne({ email: inputEmail })
    const numberCheck = await userModel.findOne({ mobile: inputNumber })
    if (emailCheck || numberCheck) {
      res.render('user/signup', { wrong: 'User already Exists' })
    } else {
      const tempOTP = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000
      req.session.tempOTP = tempOTP

      // Transporter
      const transporter = await nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TRANSPORTER_USERNAME,
          pass: process.env.TRANSPORTER_PASSWORD
        }
      })

      // Mail options
      const mailOptions = await {
        from: process.env.TRANSPORTER_USERNAME,
        to: inputEmail,
        subject: 'OTP Verification | shoeMart eCommerce',
        html: `<p>${tempOTP}</p>`
      }

      // Send mail
      await transporter.sendMail(mailOptions)
      console.log('Account creation OTP Sent: ' + req.session.tempOTP)
      res.render('user/otp',{userdata})
    }
  } catch (error) {
    console.log('Signup error: ' + error)
  }
}

// OTP Page
// const otpPage = (req, res) => {
//   if (req.session.tempOTP) {
//     res.render('user/otp.ejs')
//   } else {
//     res.redirect('/user/signup')
//   }
// }

// OTP verification
const otpVerification = async (req, res) => {
  const userdata = req.body
  if (req.session.tempOTP) {
    if (req.session.tempOTP === parseInt(req.body.otp)) {
      console.log('Account creation OTP deleted: ' + req.session.tempOTP)
      newUserDetails.save()
      req.session.tempOTP = false
      res.redirect('/login?succ=OTP Verified, Please login')
    } else {
      res.render('user/otp', { wrong: 'OTP incorrect',userdata })
    }
  } else {
    res.redirect('/login')
  }
}

module.exports = {
  signupPage,
  registerUser,
  // otpPage,
  otpVerification

}

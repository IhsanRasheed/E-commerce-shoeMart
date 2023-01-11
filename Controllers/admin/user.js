const userModel = require('../../Model/userModel')
const cartModel = require('../../Model/cartModel')

const management = async (req, res) => {
  const users = await userModel.find()
  res.render('admin/userManagement.ejs', { users })
}

const block = async (req, res) => {
  const id = req.query.id
  const userdata = await userModel.findById({ _id: id })
  if (userdata.status === true) {
    await cartModel.updateOne({ _id: id }, { $set: { status: false } })
    res.redirect('/admin/user')
  } else {
    await userModel.updateOne({ _id: id }, { $set: { status: true } })
    res.redirect('/admin/user')
  }
}

module.exports = {
  management,
  block
}

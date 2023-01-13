const couponModel = require('../../Model/couponModel')

const management = async (req, res) => {
  try {
    const coupons = await couponModel.find()
    // console.log(coupon)
    res.render('admin/couponManagement', { coupons })
  } catch (error) {
    console.log('coupon management error ' + error)
  }
}

const add = async (req, res) => {
  try {
    const newCoupon = couponModel({
      name: req.body.name,
      code: req.body.code.toUpperCase(),
      discount: req.body.discount,
      minAmount: req.body.minamount,
      startingDate: req.body.startingdate,
      expiryDate: req.body.expirydate
    })
    newCoupon.save()
    res.redirect('/admin/coupon')
  } catch (error) {
    console.log(error)
  }
}

const block = async (req, res) => {
  const id = req.query.id
  const couponData = await couponModel.findById({ _id: id })
  if (couponData.status === true) {
    await couponModel.updateOne({ _id: id }, { $set: { status: false } })
    res.redirect('/admin/coupon')
  } else {
    await couponModel.updateOne({ _id: id }, { $set: { status: true } })
    res.redirect('/admin/coupon')
  }
}

module.exports = {
  management,
  add,
  block

}

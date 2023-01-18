const couponModel = require('../../Model/couponModel')
const mongoose = require('mongoose')

const couponCheck = async (req, res) => {
  try {
    const code = req.body.input
    let total = req.body.total
    total = parseInt(total)
    couponModel.findOne({ code }).then((couponExist) => {
      if (couponExist) {
        const currentDate = new Date()
        if (currentDate >= couponExist.startingDate && currentDate <= couponExist.expiryDate) {
          let id = req.session.user
          id = mongoose.Types.ObjectId(req.session.user)

          couponModel.findOne({ code }, { users: { $elemMatch: { userId: id } } }).then((exist) => {
            if (exist.users.length === 0) {
              if (total >= couponExist.minAmount) {
                res.json({ couponApplied: couponExist })
              } else {
                const minAmount = couponExist.minAmount

                res.json({ minAmount })
              }
            } else {
              res.json({ userUsed: true })
            }
          })
        } else {
          res.json({ expired: true })
        }
      } else {
        res.json({ notExist: true })
      }
    })
  } catch (error) {
    console.log(error)
    res.redirect('/404')
  }
}

module.exports = {
  couponCheck
}

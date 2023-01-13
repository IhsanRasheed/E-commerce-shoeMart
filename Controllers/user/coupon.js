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
          console.log('coupon date checked')
          let id = req.session.user
          id = mongoose.Types.ObjectId(req.session.user)
          console.log(id)
          // const userExist = couponExist.users.findIndex((couponExist) => couponExist.users == id);
          couponModel.findOne({ code }, { users: { $elemMatch: { userId: id } } }).then((exist) => {
            console.log(exist)
            if (exist.users.length === 0) {
              console.log('user not used')
              if (total >= couponExist.minAmount) {
                console.log('ok with copon min amount')
                res.json({ couponApplied: couponExist })
              } else {
                const minAmount = couponExist.minAmount
                console.log('Not Ok')
                res.json({ minAmount })
              }
            } else {
              // console.log('illa');
              // user ind
              res.json({ userUsed: true })
            }
          })
          // console.log(userExist);
          // the coupon is valid
        } else {
          res.json({ expired: true })
        }
        // res.json({exist:'hai'})
      } else {
        res.json({ notExist: true })
      }
      //  console.log(couponExist);
    })
    // console.log(req.body.data.couponCheck)
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  couponCheck
}

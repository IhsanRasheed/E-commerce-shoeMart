const bannerModel = require('../../Model/bannerModel')

const management = async (req, res) => {
  try {
    const banner = await bannerModel.find()
    console.log(banner)
    res.render('admin/bannerManagement', { banner })
  } catch (error) {
    console.log(error)
  }
}

const add = async (req, res) => {
  try {
    const newBanner = new bannerModel({
      name: req.body.name,
      image: req.files
    })
    newBanner.save()
    res.redirect('/admin/banner')
  } catch (error) {
    console.log(error)
  }
}

const block = async (req, res) => {
  try {
    const id = req.query.id
    console.log(id)
    const bannerData = await bannerModel.findById({ _id: id })
    if (bannerData.status === true) {
      await bannerModel.updateOne({ _id: id }, { $set: { status: false } })
      res.redirect('/admin/banner')
    } else {
      await bannerModel.updateOne({ _id: id }, { $set: { status: true } })
      res.redirect('/admin/banner')
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  management,
  add,
  block
}

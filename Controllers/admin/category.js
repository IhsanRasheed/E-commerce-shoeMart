/* eslint-disable no-var */
const categoryModel = require('../../Model/categoryModel')
const mongoose = require('mongoose')

const management = async (req, res) => {
  const categories = await categoryModel.find()
  const a = req.query.wrong
  res.render('admin/categoryManagement.ejs', { categories, wrong: a })
}

const add = async (req, res) => {
  const categoryName = req.body.category.toUpperCase()
  const categoryCheck = await categoryModel.findOne({ name: categoryName })
  if (categoryCheck) {
    res.redirect('/admin/category?wrong=category already exist')
  } else {
    const newCategory = categoryModel({
      name: categoryName
    })
    newCategory.save()
    res.redirect('/admin/category')
  }
}

const block = async (req, res) => {
  const id = req.query.id
  const categoryData = await categoryModel.findById({ _id: id })
  if (categoryData.status === true) {
    await categoryModel.updateOne({ _id: id }, { $set: { status: false } })
    res.redirect('/admin/category?')
  } else {
    await categoryModel.updateOne({ _id: id }, { $set: { status: true } })
    res.redirect('/admin/category')
  }
}

{ let categoryData
  try {
    let categoryID
    var edit = async (req, res) => {
      categoryID = req.query.id
      const a = req.query.wrong
      categoryData = await categoryModel.findById({ _id: new mongoose.Types.ObjectId(categoryID) })
      // console.log(categoryData)
      res.render('admin/categoryEdit', { categoryData, wrong: a })
    }
  } catch (error) {
    console.log(error)
  }

  var postEdit = async (req, res) => {
    try {
      const categoryName = req.body.category.toUpperCase()
      const categoryCheck = await categoryModel.findOne({ name: categoryName })
      const categoryID = req.query.id
      if (categoryCheck) {
        res.render('admin/categoryEdit', { categoryData, wrong: 'Category already Exists' })
        // res.redirect('/admin/category/edit?wrong=category already exist')
      } else {
        await categoryModel.findByIdAndUpdate(
          { _id: categoryID },
          { $set: { name: categoryName } }
        )
        res.redirect('/admin/category')
      }
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  management,
  add,
  block,
  edit,
  postEdit

}

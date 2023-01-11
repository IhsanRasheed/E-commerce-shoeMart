const productModel = require('../../Model/productModel')
const categoryModel = require('../../Model/categoryModel')
const mongoose = require('mongoose')

const management = async (req, res) => {
  try {
    const categories = await categoryModel.find({ status: true })
    const products = await productModel.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'catData'
        }
      }
    ])
    // console.log(products[4].catData[0])
    res.render('admin/productManagement.ejs', { products, categories })
  } catch (error) {
    console.log(error)
  }
}

const add = async (req, res) => {
  try {
    const productName = req.body.name.toUpperCase()
    const data = await categoryModel.findOne({ name: req.body.category })
    const product = productModel({
      name: productName,
      category: data._id,
      brand: req.body.brand,
      size: req.body.size,
      description: req.body.description,
      stock: req.body.stock,
      price: req.body.price,
      image: req.files
    })
    product.save()
    res.redirect('/admin/product')
  } catch (error) {
    console.log(error.message)
  }
}

const block = async (req, res) => {
  const id = req.query.id
  const productData = await productModel.findById({ _id: id })
  if (productData.status === true) {
    await productModel.updateOne({ _id: id }, { $set: { status: false } })
    res.redirect('/admin/product')
  } else {
    await productModel.updateOne({ _id: id }, { $set: { status: true } })
    res.redirect('/admin/product')
  }
}

try {
  let productID
  // eslint-disable-next-line no-var
  var edit = async (req, res) => {
    try {
      const categoryData = await categoryModel.find({ status: true })
      productID = req.query.id
      const productData = await productModel.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(productID)
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'catData'
          }
        }
      ])
      res.render('admin/productEdit', {
        categoryData,
        productData
      })
    } catch (error) {
      console.log(error)
    }
  }

  // eslint-disable-next-line no-var
  var postEdit = async (req, res) => {
    try {
      if (typeof req.file === 'undefined') {
        // var a = req.body.category
        // console.log(req.body)
        const data = await categoryModel.findOne({ name: req.body.category })
        const productName = req.body.name.toUpperCase()
        await productModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(productID) },
          {
            $set: {
              name: productName,
              category: data._id,
              brand: req.body.brand,
              description: req.body.description,
              stock: req.body.stock,
              price: req.body.price
            }
          }
        )
        res.redirect('/admin/product')
      } else {
        const data = await categoryModel.findOne({ name: req.body.category })
        await productModel.findByIdAndUpdate(
          { _id: new mongoose.Types.ObjectId(productID) },
          {
            $set: {
              name: req.body.name,
              category: data._id,
              brand: req.body.brand,
              description: req.body.description,
              stock: req.body.stock,
              price: req.body.price,
              image: req.file.filename
            }
          }
        )
        res.redirect('/admin/product')
      }
    } catch (error) {
      console.log(error)
    }
  }
} catch (error) {
  console.log(error)
}

module.exports = {
  management,
  add,
  block,
  edit,
  postEdit
}

const orderModel = require('../../Model/orderModel')
const ejs = require('ejs')
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')
const http = require('http')
const moment = require('moment')

const salesPage = async (req, res) => {
  try {
    const orderDetails = await orderModel.find({ orderStatus: 'delivered' })
    res.render('admin/salesReport', { orderDetails })
  } catch (error) {
    console.log(error)
  }
}

const PDFdata = async (req, res) => {
  try {
    const salesDate = req.body
    // console.log(salesDate)
    const startDate = new Date(salesDate.from)
    const endDate = new Date(salesDate.to)
    // console.log(startDate)
    // console.log(endDate)
    const dateFrom = moment(salesDate.from).format('DD/MM/YYYY')
    const dateto = moment(salesDate.to).format('DD/MM/YYYY')
    // console.log(dateFrom)
    // console.log(dateto)
    const orderData = await orderModel.find(
      { $and: [{ orderDate: { $gte: startDate, $lte: endDate } }, { orderStatus: 'delivered' }] })
    // console.log(orderData)
    const total = orderData.reduce((acc, curr) => {
      acc = acc + curr.totalAmount
      return acc
    }, 0)
    // console.log(total)
    const data = {
      orderData,
      total,
      dateFrom,
      dateto
    }
    // console.log(data)
    const option = {
      format: 'A4',
      border: '20px'
    }
    // console.log(option)
    const filePath = path.resolve(__dirname, '../../views/admin/pdfDownload.ejs')
    const htmlString = fs.readFileSync(filePath).toString()
    const ejsData = ejs.render(htmlString, data)
    pdf.create(ejsData, option).toFile('salesReport.pdf', (err, file) => {
      if (err) {
        console.log(err)
      }

      // console.log('pdf')
      // const filePath = path.resolve(__dirname, 'sales.pdf')
      // fs.readFile(filePath, (err, file) => {
      //   if (err) {
      //     console.log(err)
      //   }

      //   res.setHeader('Content-Type', 'application/pdf')
      //   res.setHeader('Content-Disposition', 'attachement;filename="salesReport.pdf"')
      //   res.send(file)
      //   console.log('pdf generated')
      // })
    })

    //   console.log(orderData);
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  salesPage,
  PDFdata
}

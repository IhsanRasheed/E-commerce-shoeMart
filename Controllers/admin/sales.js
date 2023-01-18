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

const postPDFData = async (req, res) => {
  try {
  //  console.log(req.body)
    const salesDate = req.body
    const startDate = new Date(salesDate.from)
    const endDate = new Date(salesDate.to)
    const dateFrom = moment(salesDate.from).format('DD/MM/YYYY')
    const dateto = moment(salesDate.to).format('DD/MM/YYYY')
    //  console.log(dateFrom+"dd"+dateto)
    const orderData = await orderModel.find(
      { $and: [{ orderDate: { $gte: startDate, $lte: endDate } }, { orderStatus: 'delivered' }] })
    //  console.log(orderData);
    const total = orderData.reduce((acc, curr) => {
      acc = acc + curr.totalAmount
      return acc
    }, 0)

    res.render('admin/pdfDownload', {
      orderData,
      total,
      dateFrom,
      dateto
    })

    // const data = {
    //   orderData,
    //   total,
    //   dateFrom,
    //   dateto
    // }
    // const option = {
    //   format: 'A4',
    //   border: '20px'
    // }
    // const filePath = path.resolve(__dirname, 'pdfDownload.ejs')
    // const htmlString = fs.readFileSync(filePath).toString()
    // const ejsData = ejs.render(htmlString, data)
    // pdf.create(ejsData, option).toFile('sales_report.pdf', (err, file) => {
    //   if (err) {
    //     console.log(err)
    //   }

    //   console.log('pdf')

    //   const filePath = path.resolve(__dirname, 'sales_report.pdf')
    //   fs.readFile(filePath, (err, file) => {
    //     if (err) {
    //       console.log(err)
    //     }

    //     res.setHeader('Content-Type', 'application/pdf')
    //     res.setHeader('Content-Disposition', 'attachement;filename="sales_report.pdf"')
    //     res.send(file)
    //     console.log('pdf generated')
    //   })
    // })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  salesPage,
  postPDFData

}

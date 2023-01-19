const orderModel = require('../../Model/orderModel')
const ejs = require('ejs')
const pdf = require('html-pdf')
const fs = require('fs')
const path = require('path')
const http = require('http')
const moment = require('moment')
const excelJS = require('exceljs')

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
    req.session.order = orderData
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
    // const filePathName = path.resolve(__dirname, '../../views/admin/pdfDownload.ejs')
    // const htmlString = fs.readFileSync(filePathName).toString()
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

const csvDownload = async (req, res) => {
  try {
    const total = req.query.total
    const saledata = req.session.order
    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet('Sales Roport')
    worksheet.columns = [
      { header: 's no.', key: 's_no' },
      { header: 'Order ID', key: '_id', width: 30 },
      { header: 'Date', key: 'Date', width: 15 },
      { header: 'Order Status', key: 'orderStatus', width: 15 },
      { header: 'Payment Method', key: 'paymentMethod', width: 15 },
      { header: 'Total Amount', key: 'totalAmount' },
      { header: 'Grand Total', key: 'total' }

    ]
    let counter = 1
    const length = saledata.length
    saledata.forEach((sale, i) => {
      const dateFrom = moment(sale.orderDate).format('DD/MM/YYYY')
      sale.Date = dateFrom
      sale.s_no = counter
      if (i === length - 1) {
        sale.total = total
      }
      worksheet.addRow(sale)
      counter++
    })

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true }
    })

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    )

    res.setHeader('Content-Disposition', 'attachment; filename=sales_Report.xlsx')

    return workbook.xlsx.write(res).then(() => {
      res.status(200)
    })
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  salesPage,
  postPDFData,
  csvDownload

}

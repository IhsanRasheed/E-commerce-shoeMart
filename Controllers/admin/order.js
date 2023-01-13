const orderModel = require('../../Model/orderModel')

const management = async (req,res)=>{
    try{
        orderModel.find().then((orders)=>{
            res.render('admin/orderMangement', {orders})
        })

    }catch(error){
        console.log(error)
    }
}

const update = async(req,res)=>{
    try{
        const id = req.body.orderid
        const status = req.body.orderstatus
        console.log(id)
        console.log(status)
        await orderModel.updateOne({_id: id},{ $set: {orderStatus: status}})

        res.redirect('/admin/order')
    }catch(error){
        console.log(error)
    }
    
  }

module.exports={
    management,
    update
}
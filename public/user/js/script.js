
function addtocart (proId) {
  $.ajax({
    url: '/addtocart',
    method: 'post',
    data: {
      Id: proId
    },
    success: (response) => {
      if (response.exist) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Product Already in Cart..!',
          showConfirmButton: false,
          timer: 1500
          // title: "Product Already in Wishlist..!",
          // icon: "warning",
          // confirmButtonText: false,
          // timer: 1000
          //   }).then(function () {
          //     location.reload();
        })
      }
      if (response.success) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'product add successfully',
          showConfirmButton: false,
          timer: 1500
        })
        const count = response.count
        $('#cart_count').html(count)
      }
      if (response.outofStock) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Sorry,Product Out of Stock..!',
          showConfirmButton: false,
          timer: 1500

        })
      }
    }
  })
}

function addQty (proId, position) {
  $.ajax({
    url: '/productadd',
    method: 'patch',
    data: {
      Id: proId,
      position,
      qty: $('#qty_' + position).html()
    },
    success: (response) => {
      if (response.price) {
        const price = response.price
        let qty = $('#qty_' + position).html()
        qty = parseInt(qty) + 1
        $('#qty_' + position).html(qty)

        let total = $('#total_' + position).html()
        total = parseInt(total) + price
        $('#total_' + position).html(total)

        let subtotal = $('#subtotal_2').html()
        subtotal = parseInt(subtotal) + price
        $('#subtotal_1').html(subtotal)
        $('#subtotal_2').html(subtotal)
      }
      if (response.outStock) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Out of Stock..!',
          showConfirmButton: false,
          timer: 1500
        })
      }
      if (response.limit) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Limit Exist..!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  }
  )
}

function subQty (proId, position) {
  $.ajax({
    url: '/productsub',
    method: 'patch',
    data: {
      Id: proId,
      position,
      qty: $('#qty_' + position).html()
    },
    success: (response) => {
      if (response.price) {
        const price = response.price
        let qty = $('#qty_' + position).html()
        qty = parseInt(qty) - 1
        $('#qty_' + position).html(qty)

        let total = $('#total_' + position).html()
        total = parseInt(total) - price
        $('#total_' + position).html(total)

        let subtotal = $('#subtotal_2').html()
        subtotal = parseInt(subtotal) - price
        $('#subtotal_1').html(subtotal)
        $('#subtotal_2').html(subtotal)
      }
      if (response.outStock) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Out of Stock..!',
          showConfirmButton: false,
          timer: 1500
        })
      }
      if (response.limit) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Minimum one required!',
          showConfirmButton: false,
          timer: 1500
        })
      }
    }
  }
  )
}

function addtowish (prodId) {
  $.ajax({
    url: '/addtowish',
    method: 'post',
    data: {
      prodId
    },
    success: (response) => {
      if (response.wish) {
        Swal.fire({
          position: 'center',
          icon: 'warning',
          title: 'Product Already in Wishlist...!',
          showConfirmButton: false,
          timer: 1500
        })
      }
      if (response.success) {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Product added Successfully',
          showConfirmButton: false,
          timer: 1500
        })
        const count = response.count
        $('#wishlit_count').html(count)
      }
    }
  })
}

function deletewish (proId) {
  $.ajax({
    url: '/wishlist',
    method: 'delete',
    data: {
      proId
    },
    success: (res) => {
      if (res.success) {
        $('#table').load(location.href + ' #table')
      }
    }

  })
}

function setaddress (id) {
  $.ajax({
    url: '/setaddress',
    method: 'post',
    data: {
      addresId: id
    },
    success: (response) => {
      console.log(response.data)
      $('#adres_name').val(response.data[0].name)
      $('#adres_line1').val(response.data[0].addressline1)
      $('#adres_line2').val(response.data[0].addressline2)
      $('#adres_district').val(response.data[0].district)
      $('#adres_state').val(response.data[0].state)
      $('#adres_country').val(response.data[0].country)
      $('#adres_pin').val(response.data[0].pin)
      $('#adres_mobile').val(response.data[0].mobile)
    }

  })
}

function couponCheck (event) {
  // prevent the form from being submitted
  event.preventDefault()

  // get the value of the input field
  const inputValue = $('#couponCode').val()

  // create an AJAX request
  $.ajax({
    type: 'post',
    url: '/coupon_check',
    data: { input: inputValue, total: $('#total').html() },
    success: function (response) {
      if (response.couponApplied) {
        $('#message').html('Coupon Applied').css('color', 'green')
        let discount = response.couponApplied.discount
        const code = response.couponApplied.code
        const couponId = response.couponApplied._id
        let total = $('#total').html()
        let subtotal = $('#subtotal').html()
        discount = parseInt(discount)
        subtotal = parseInt(subtotal)
        const discountedPrice = (discount * subtotal) / 100
        total = subtotal - discountedPrice
        $('#total').html(total)
        $('#coupon_code').html(code)
        $('#couponId').val(couponId)
        $('#total_amount').val(total)
      }
      if (response.notExist) {
        $('#message').html('Coupon Not Found!!').css('color', 'red')
      }
      if (response.expired) {
        $('#message').html('Coupon Expired!!').css('color', 'red')
      }
      if (response.userUsed) {
        $('#message').html('Coupon Already Used!!').css('color', 'red')
      }
      if (response.minAmount) {
        const minAmount = response.minAmount
        $('#message').html('Minimum ' + minAmount + ' required!!').css('color', 'red')
      }
      // update the page with the response
      // $("#response").html(response);
    }
  })
};

// $(document).ready(function () {
//   $('#form').submit(function (e) {
//     // e.preventDefault()
//     const formData = $(this).serialize()
//     $.ajax({
//       type: 'POST',
//       url: '/checkout',
//       data: formData,
//       success: (response) => {
//         if (response.fail) {
//           location.href = '/payment_fail'
//         } else if (response.CODSuccess) {
//           location.href = '/payment_succuss'
//         } else {
//           const order = response.order
//           const orderDetails = response.orderDetails
//           razorPay(order, orderDetails)
//         }
//       }
//     })
//   })
// })

// const form = document.querySelector('.form')
// form.addEventListener('submit', async event => {
//   event.preventDefault()
//   const formData = new FormData(form)
//   const payment = formData.get('paymentMethode')
//   const response = await fetch('http://localhost:4000/checkout', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       payment
//     })
//   })
//   const orderData = await response.json()
//   console.log(orderData)
//   if (orderData.success === false) {
//     location.href = orderData.url
//   } else {
//     const options = {
//       key: 'rzp_test_2xERoSusyd4f84', // Enter the Key ID generated from the Dashboard
//       amount: orderData.amount * 100,
//       currency: 'INR',
//       name: 'Acme Corp',
//       order_id: orderData.id,
//       handler: function (response) {
//         // alert(response.razorpay_payment_id);
//         // alert(response.razorpay_order_id);
//         // alert(response.razorpay_signature);
//         location.href = orderData.url
//       }
//     }
//     const rzp1 = new Razorpay(options)
//     rzp1.open()
//   }
// })

// function razorPay (order, orderDetails) {
//   const options = {
//     key: 'rzp_test_pTxoFkiwXZuGgu', // Enter the Key ID generated from the Dashboard
//     amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
//     currency: 'INR',
//     name: 'TechKart',
//     description: 'Test Transaction',
//     image: 'https://example.com/your_logo',
//     order_id: order.id, // This is a sample Order ID. Pass the `id` obtained in the response of Step 1
//     handler: function (response) {
//       verifyPayment(response, order, orderDetails)
//     },
//     prefill: {
//       name: 'Abdulla',
//       email: 'sapabdu@gmail.com',
//       contact: '9999999999'
//     },
//     notes: {
//       address: 'Razorpay Corporate Office'
//     },
//     theme: {
//       color: '#3399cc'
//     }
//   }
//   const rzp1 = new Razorpay(options)
//   rzp1.on('payment.failed', function (response) {
//     location.href = '/payment_fail'
//   })
//   rzp1.open()
// }

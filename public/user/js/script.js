
function add_to_cart(proId){
    $.ajax({
        url:'/add_to_cart',
        method:'post',
        data: {
            Id:proId
        },
        success:(response)=>{
            if(response.exist){
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
                  });
                
                }
                if(response.success){
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: 'product add successfully',
                        showConfirmButton: false,
                        timer: 1500
                      })
                      let count=response.count
                      $("#cart_count").html(count)

                }
                if(response.outofStock){
                    Swal.fire({
                        position: 'center',
                            icon: 'warning',
                            title: 'Sorry,Product Out of Stock..!',
                            showConfirmButton: false,
                            timer: 1500
                       
                      });
                    
                    }        
        }
    })
}

function addQty(proId,position){
    $.ajax({
        url:'/productadd',
        method:'patch',
        data:{
            Id:proId,
            position:position,
            qty:$('#qty_'+position).html()
        },
        success:(response)=>{
            if(response.price){
            let price=response.price
            let qty=$('#qty_'+position).html()
            qty=parseInt(qty)+1
            $('#qty_'+position).html(qty)

            let total=$('#total_'+position).html()
            total=parseInt(total)+price
            $('#total_'+position).html(total)

            let subtotal=$('#subtotal_2').html()
            subtotal=parseInt(subtotal)+price
            $('#subtotal_1').html(subtotal)
            $('#subtotal_2').html(subtotal)
            }
            if(response.outStock){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Out of Stock..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            if(response.limit){
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


function subQty(proId,position){
    $.ajax({
        url:'/productsub',
        method:'patch',
        data:{
            Id:proId,
            position:position,
            qty:$('#qty_'+position).html()
        },
        success:(response)=>{
            if(response.price){
            let price=response.price
            let qty=$('#qty_'+position).html()
            qty=parseInt(qty)-1
            $('#qty_'+position).html(qty)

            let total=$('#total_'+position).html()
            total=parseInt(total)-price
            $('#total_'+position).html(total)

            let subtotal=$('#subtotal_2').html()
            subtotal=parseInt(subtotal)-price
            $('#subtotal_1').html(subtotal)
            $('#subtotal_2').html(subtotal)
            }
            if(response.outStock){
                Swal.fire({
                    position: 'center',
                        icon: 'warning',
                        title: 'Out of Stock..!',
                        showConfirmButton: false,
                        timer: 1500
                })
            }
            if(response.limit){
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




function addtowish(prodId){
    $.ajax({
        url:'/addtowish',
        method:'post',
        data : {
           prodId  
        },
        success:(response)=>{
            if(response.wish){
                Swal.fire({
                    position: 'center',
                    icon:'warning',
                    title: 'Product Already in Wishlist...!',
                    shownConfiguration: false,
                    timer: 1500
                })
            }
            if(response.success){
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Product added Successfully',
                    shownConfiguration: false,
                    timer:1500
                })
                let count = response.count
                $("#wishlit_count").html(count)
            }
        }
    })
}

function setaddress(id){
    $.ajax({
        url:'/setaddress',
        method:'post',
        data : {
            addresId : id
        },
        success:(response)=>{
            console.log(response.data);
            $("#adres_name").val(response.data[0].name);
            $("#adres_line1").val(response.data[0].addressline1);
            $("#adres_line2").val(response.data[0].addressline2);
            $("#adres_district").val(response.data[0].district);
            $("#adres_state").val(response.data[0].state);
            $("#adres_country").val(response.data[0].country);
            $("#adres_pin").val(response.data[0].pin);
            $("#adres_mobile").val(response.data[0].mobile);
            
            }

    })
}



 function couponCheck(event){
    // prevent the form from being submitted
    event.preventDefault();
  
    // get the value of the input field
    var inputValue = $("#couponCode").val();
  
    // create an AJAX request
    $.ajax({
      type: "post",
      url: "/coupon_check",
      data: { input: inputValue,total:$('#total').html() },
      success: function(response) {
        if(response.couponApplied){
        $('#message').html('Coupon Applied').css('color', 'green');
        let discount=response.couponApplied.discount
        let code=response.couponApplied.code
        let couponId=response.couponApplied._id
        let total=$('#total').html()
        let subtotal=$('#subtotal').html()
        discount=parseInt(discount)
        subtotal=parseInt(subtotal)
        let discountedPrice=(discount*subtotal)/100
        total=subtotal-discountedPrice
        $('#total').html(total)
        $('#coupon_code').html(code)
        $('#couponId').val(couponId)
        $('#total_amount').val(total)
        }
        if(response.notExist){
            $('#message').html('Coupon Not Found!!').css('color', 'red');
            }
        if(response.expired){
           $('#message').html('Coupon Expired!!').css('color', 'red');  
            }
        if(response.userUsed){
            $('#message').html('Coupon Already Used!!').css('color', 'red');  
        }
        if(response.minAmount){
            let minAmount=response.minAmount
            $('#message').html('Minimum '+minAmount+' required!!').css('color', 'red');  
        }
        // update the page with the response
        // $("#response").html(response);
      }
    });
  };



//   function submitForm() {
//     e.preventDefault();
//     var formData = $(this).serialize();
//     $.ajax({
//                    url: '/checkout',
//                     method: 'POST',
                  
//                      data: formData,
//                     success:  (response) => {
  
   
// }
//     })}


//     $("input[type='submit']").on("click", function(){

//         e.preventDefault();
//     var formData = $(this).serialize();
//     $.ajax({
//                    url: '/checkout',
//                     method: 'POST',
                  
//                      data: formData,
//                     success:  (response) => {
//                         // if(response.order){
//                         //     let order =response.order
//                         // razorPay(order)
//                         // }
//                         location.href="/"
// }
//         // your code here
//     })
// })



    







// function verifyPayment(payment, order,orderDetails) {
//     // console.log(payment)
//     // console.log(order)

//     $.ajax({
//         url: "/verifyPayment",
//         data: {
//             payment,
//             order,
//             orderDetails
//         },
//         method: "post",
//         success: (response) => {
//             if (response.success) {
//                 location.href = "/payment_succuss";
//             } else {
//                 location.href = "/payment_fail";
//             }
//         },
//     });
// }
    
   
$(document).ready(function() {
    $('#example').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
} );

$(document).ready(function() {
    $('#example2').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
} );

$(document).ready(function() {
    $('#example3').DataTable( {
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'pdf', 'print'
        ]
    } );
} );


$(document).ready(function () {
    $('#userTable').DataTable();
  });


  function deleteOffer(categoryId){
    swal({
          title: "Are you sure?",
          text: "It will also delete the products of this category",
          icon: "warning",
          buttons: true,
          dangerMode: true,
        })
        .then((willDelete) => {
            if (willDelete) {
               $.ajax({
                        url:'/admin/deleteOffer',
                          data:{
                            categoryId:categoryId
                          },
                        type:'POST',
                        success:(response)=>{
                            if(response.status){
                                swal("Successfully deleted", {
                                    icon: "success",
                                  });
                                                  
                                    location.reload()
                            }
                             
                            
                        }
                    })
              
            } else {
              swal("Your Offer safe!");
            }
          });
   }
   function Addproduct(){
    swal("Success!", "Product added successfully", "success");
   }
   function Addcoupon(){
    swal("Success!", "coupon added successfully", "success");

   }
   function Addbanner(){
    swal("Success!", "banner added successfully", "success");

   }
function Addcategory(){
    swal("Success!", "category added successfully", "success");
 
}
function editproduct(){
    swal("Success!", "product added successfully", "success");

}
function categoryupdated(){
    swal("Success!", "category edited successfully", "success");


}
function bannerupdated(){
    swal("Success!", "banner edited successfully", "success");

}
// function invoice1(length, address, orderNo) {
//     var date = new Date().toDateString().slice(3);
//     var productArray = [];
  
//     for (var i = 0; i < length; i++) {
//       var productName = document.getElementById("pName" + i).innerText;
//       var productPrice = document.getElementById("pPrice" + i).innerText;
//       var productQuantity = document.getElementById("pQ" + i).innerText;
  
//       var product = {
//         "quantity": productQuantity,
//         "description": productName,
//         "tax-rate": 0,
//         "price": productPrice
//       };
  
//       productArray.push(product);
//     }
  
//     var data = {
//       "customize": {},
//       "images": {
//         "logo": "https://i.postimg.cc/Z5MvWH77/2.webp",
//       },
//       "sender": {
//         "company": "cozastore.",
//         "address": "perumbavoor",
//         "zip": "683556",
//         "city": "Ernakulam",
//         "country": "India"
//       },
//       "client": {
//         "company": address,
//         "address": "",
//         "zip": "",
//         "city": "",
//         "country": ""
//       },
//       "information": {
//         "number": orderNo,
//         "date": date,
//         "due-date": "NA"
//       },
//       "products": productArray,
//       "bottom-notice": "Thank You for choosing our store",
//       "settings": {
//         "currency": "INR"
//       },
//       "translate": {}
//     };
  
//     easyinvoice.createInvoice(data, function (result) {
//       easyinvoice.download("invoice.pdf");
//     });
//   }
  
  
  
  
  
  
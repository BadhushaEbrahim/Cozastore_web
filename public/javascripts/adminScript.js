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
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
   function validateProductForm(){
    // Get form inputs
    var name = document.getElementById('username').value;
    var category = document.getElementById('category').value;
    var price = document.getElementById('price').value;
    var description = document.getElementById('description').value;
    var stock = document.getElementById('stock').value;
    var image = document.getElementById('image').value;
    var image1 = document.getElementById('image1').value;
    var image2 = document.getElementById('image2').value;
    var image3 = document.getElementById('image3').value;
    
    // Perform validation
    if (name === '') {
        Swal.fire('Error', 'Please enter a product name.', 'error');
        return false;
    }
    
    if (category === '') {
        Swal.fire('Error', 'Please select a product category.', 'error');
        return false;
    }
    
    if (price === '') {
        Swal.fire('Error', 'Please enter a product price.', 'error');
        return false;
    }
    
    if (price < 0) {
        Swal.fire('Error', 'Price cannot be less than 0.', 'error');
        return false;
    }
    
    // Perform additional validation for other fields
    
    // All validations passed, show success alert and submit the form
    Swal.fire('Success', 'product added successfully.', 'success');
    return true;
}


$("#updateUser").submit((e) => {
  e.preventDefault()
  $.ajax({
    url: '/editUserProfile',
    method: 'post',
    data: $('#updateUser').serialize(),
    success: (response) => {

      if (response.status) {
        swal("Sucess", "User Profile updated", "success");
      }
    }
  })
})


$(document).ready(function () {
  $('#userTable').DataTable();
});


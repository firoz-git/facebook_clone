function friend(id) {
  console.log(id)
    $.ajax({
      url: "/addFriend/" + id,
      method: "get",
      success: (response) => {
        if (response.status) {
          alert("Friend added")
  
        }
      },
    });
  }

  function unfriend(id) {
    $.ajax({
      url: "/removeFriend/" + id,
      method: "get",
      success: (response) => {
        if (response.status) {
          alert("Friend removed")
  
        }
      },
    });
  }
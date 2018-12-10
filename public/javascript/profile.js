function shareEvent(element) {
    var eventID = element.getAttribute("data-id");
    // get the input
    var toUser = element.getElementsByTagName("input")[0].value;

    var requestData = {
        "eventID": eventID,
        "toUser": toUser
    }
    var alertsDiv = document.getElementById("alertsDiv")
    alertsDiv.style = "display: none;";
    $.ajax({
        url: 'http://localhost:3000/profile/share',
        type: 'POST',
        timeout: 30 * 1000,
        dataType: "json",
        data: requestData,
        error: function(jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
            console.log(jqXHR, textStatus, errorThrown);
            alertsDiv.style = "display: block;";
            alertsDiv.innerHTML = jqXHR.responseJSON;
        },
        success: function(data) {
            alert("success");
        },   
    });
}

function removeSharedEvent(element) {
    var eventID = element.getAttribute("data-eventID");
    // get the input
    var username = element.getAttribute("data-user");

    var requestData = {
        "eventID": eventID,
        "username": username
    };

    var alertsDiv = document.getElementById("alertsDiv")
    alertsDiv.style = "display: none;";
    $.ajax({
        url: 'http://localhost:3000/profile/unshare',
        type: 'POST',
        timeout: 30 * 1000,
        dataType: "json",
        data: requestData,
        error: function(jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
            console.log(jqXHR, textStatus, errorThrown);
            alertsDiv.style = "display: block;";
            alertsDiv.innerHTML = jqXHR.responseJSON;
        },
        success: function(data) {
            alert("success");
        },   
    });
}

function removeSavedEvent(element) {
    var eventID = element.getAttribute("data-eventID");

    var requestData = {
        "eventID": eventID,
    };

    var alertsDiv = document.getElementById("alertsDiv")
    alertsDiv.style = "display: none;";
    $.ajax({
        url: 'http://localhost:3000/profile/unsave',
        type: 'POST',
        timeout: 30 * 1000,
        dataType: "json",
        data: requestData,
        error: function(jqXHR, textStatus, errorThrown) {
            // alert(errorThrown);
            console.log(jqXHR, textStatus, errorThrown);
            alertsDiv.style = "display: block;";
            alertsDiv.innerHTML = jqXHR.responseJSON;
        },
        success: function(data) {
            alert("success");
        },   
    });
}
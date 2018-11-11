$(document).ready(function() {
	$('#startDatetimepicker').datetimepicker({ stepping: 15, format: 'MMMM Do YYYY, h:mm a', minDate: new Date, defaultDate: new Date})
	$('#endDatetimepicker').datetimepicker({ stepping: 15, format: 'MMMM Do YYYY, h:mm a', minDate: new Date })

	var endTimeInput = $("#endDatetime")[0]
	var invalidEndTime = document.getElementById("endTimeMissing")
	var startTimeInput = $("#startDatetime")[0]
	var zipInput =  $("#zip")[0]
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.getElementsByClassName('needs-validation');

    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
      	invalidEndTime.innerHTML = "Please provide an end time."
      	endTimeInput.setCustomValidity("")
      	startTimeInput.setCustomValidity("")

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else{
	        event.preventDefault();
	        var formData = $('form').serializeArray();
	        // console.log(formData)
	        // this is what the ticketmaster API expects
	        var startTime = moment.utc(moment(formData[0]['value'], 'MMMM Do YYYY, h:mm a')).format()
	        var endTime = moment.utc(moment(formData[1]['value'], 'MMMM Do YYYY, h:mm a')).format()
	        if(startTime === 'Invalid date'){
	        	startTimeInput.setCustomValidity("Invalid")
	        }
	        if(endTime === 'Invalid date'){
	        	endTimeInput.setCustomValidity("Invalid")
	        }
	        if(Date.parse(endTime) < Date.parse(startTime)){
	        	endTimeInput.setCustomValidity("Invalid")
	        	invalidEndTime.innerHTML = "End time must be after start time"
	        }
	        if(form.checkValidity() === true){
	        	var request_data = {
	                "Payload": {
	                    "startDateTime": startTime,
	                    "endDateTime": endTime,
	                    "postalCode": form[2]["value"],
	                }
		        };
		        $.ajax({
		            url: 'http://localhost:3000/',
		            type: 'POST',
		            timeout: 5000,
		            dataType: "json",
		            data: request_data,
		            error: function (jqXHR, textStatus, errorThrown) {
		                alert(errorThrown);
		                $('.alert-error').show();
		                $('.alert-error span').html(errorThrown);
		            },
		            success: function (data) {
		                // console.log(data)
		                getPoints(data['Result']);
		            }
		        });
	        }

        }
        form.classList.add('was-validated');
      }, false);
    });
});
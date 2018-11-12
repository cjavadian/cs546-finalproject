$(document).ready(function() {
	// Date Time Picker Settings
	$('#startDatetimepicker').datetimepicker({ stepping: 15, format: 'MMMM Do YYYY, h:mm a', minDate: new Date, defaultDate: new Date})
	$('#endDatetimepicker').datetimepicker({ stepping: 15, format: 'MMMM Do YYYY, h:mm a', minDate: new Date })

	// getting HTML elements
	var invalidEndTime = document.getElementById("endTimeMissing")
	var endTimeInput = $("#endDatetime")[0]
	var startTimeInput = $("#startDatetime")[0]
	var zipInput =  $("#zip")[0]

	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	var forms = document.getElementsByClassName('needs-validation');

    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {

      	// hide submit button
      	document.getElementById('submitButton').style.display = 'none';
      	document.getElementById('loadButton').style.display = 'block';

      	// fix form validity reponse text
      	invalidEndTime.innerHTML = "Please provide an end time."
      	// set validity of these elements to true
      	endTimeInput.setCustomValidity("")
      	startTimeInput.setCustomValidity("")

        if (form.checkValidity() === false) {
        	// if form is not valid, prevent submission
	        event.preventDefault();
	        event.stopPropagation();

	        // display submit button
	        document.getElementById('submitButton').style.display = 'block';
      		document.getElementById('loadButton').style.display = 'none';
        } else{
        	// prevent submission
	        event.preventDefault();
	        // get all form data
	        var formData = $('form').serializeArray();
	        // console.log(formData)

	        // this is the time format ticketmaster API expects
	        var startTime = moment.utc(moment(formData[0]['value'], 'MMMM Do YYYY, h:mm a'))
	        var endTime = moment.utc(moment(formData[1]['value'], 'MMMM Do YYYY, h:mm a'))

	        // VALIDITION
	        if(startTime.format() === 'Invalid date'){
	        	startTimeInput.setCustomValidity("Invalid")
	        }
	        if(endTime.format() === 'Invalid date'){
	        	endTimeInput.setCustomValidity("Invalid")
	        }
	        if(endTime < startTime){
	        	endTimeInput.setCustomValidity("Invalid")
	        	invalidEndTime.innerHTML = "End time must be after start time"
	        }
	        if(form.checkValidity() === true){
	        	// payload to be sent to backend
	        	var request_data = {
	                "Payload": {
	                    "startDateTime": startTime.format(),
	                    "endDateTime": endTime.format(),
	                    "postalCode": form[2]["value"],
	                    "radius": form[3]['value'],
	                    "unit": form[4]['value']
	                }
		        };
		        // AJAX request to send payload to backend
		        $.ajax({
		            url: 'http://localhost:3000/',
		            type: 'POST',
		            timeout: 30 * 1000,
		            dataType: "json",
		            data: request_data,
		            error: function (jqXHR, textStatus, errorThrown) {
		                // alert(errorThrown);
		                console.log(jqXHR)

		                // Display errors sent from backend & Hide map
		                if(jqXHR.responseJSON){
		                	document.getElementById('alertsDiv').innerHTML = '<strong>' + jqXHR.responseJSON['Result']['Error'] + '</strong>';
		                } else {
		                	document.getElementById('alertsDiv').innerHTML = '<strong>' + jqXHR['statusText'] + '</strong>';
		                }
		                // display/hide alerts
        				document.getElementById('alertsDiv').style.display = 'block';
        				document.getElementById('hideMap').style.display = 'none';
        				document.getElementById('warningsDiv').style.display = 'none';
        				// display submit buttons
        				document.getElementById('submitButton').style.display = 'block';
      					document.getElementById('loadButton').style.display = 'none';
		            },
		            success: function (data) {
		            	// hide any alerts/warnings that may already be on screen
		            	document.getElementById('alertsDiv').style.display = 'none';
		            	document.getElementById('warningsDiv').style.display = 'none';
		                // display submit buttons
		                document.getElementById('submitButton').style.display = 'block';
      					document.getElementById('loadButton').style.display = 'none';

      					// console.log(data)
      					if(data['Result']['warnings']['rateLimit']){
      						document.getElementById('warningsDiv').innerHTML = '<strong>' + data['Result']['warnings']['rateLimit'] + '</strong>'
      						document.getElementById('warningsDiv').style.display = 'block';
      					}

      					// send data to google maps javascript file
		                getPoints(data['Result']['locations'], data['Result']['center']);

		                // smooth scroll to map on submission
	                    $('html, body').animate({
					        scrollTop: $("#map").offset().top
					    }, 1000);
		            }
		        });
	        }

        }
        // Bootstrap's way of validating a form if everything validates correctly
        form.classList.add('was-validated');
      }, false);
    });
});
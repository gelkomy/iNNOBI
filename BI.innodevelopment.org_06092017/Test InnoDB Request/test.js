//var serviceUrl = 'http://localhost:2999/Test';
var serviceUrl = 'http://bi.innodevelopment.org/Test';

    function sendRequest() {
        var method = $('#method').val();

        $.ajax({
            type: method,
            url: serviceUrl
        }).done(function (data) {
            $('#value1').text(data);
        }).error(function (jqXHR, textStatus, errorThrown) {
            $('#value1').text(jqXHR.responseText || textStatus);
        });
    }

    


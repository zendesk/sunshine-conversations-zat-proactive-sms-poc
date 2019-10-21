$(function() {
    //Prevent clicking on Send without the required information
    $('#send').attr("disabled", true);

    function enableSend(){
    if($('#phone').val() != '' && $('#text').val() != ''){
        $('#send').attr("disabled", false);
        }else{
        $('#send').attr("disabled", true);
        }
    }
    $('#text').on('input',function(e){
    enableSend()
    });
    $('#phone').on('input',function(e){
    enableSend()
    });

    // Initialise the Zendesk JavaScript API client
    // https://developer.zendesk.com/apps/docs/apps-v2
    var client = ZAFClient.init();
    client.invoke('resize', { width: '300px', height: '330px' });

    var appId, jwt, integrationId;

      $(document).ready(function() {
        //Fetch the app parameters
        client.metadata().then(function(meta) {
          appId = meta.settings['Smooch appId'];
          integrationId = meta.settings['SMS Integration ID'];
        });

        //Prepare and send SMS
        $('#send').click(function(e) {
          var fields = {};
          var message = $('#text').val();
          var phone = $('#phone').val();

          var data = {
            "storage": "full",
              "destination": {
                "integrationId": integrationId,
                "destinationId": phone
            },
            "message": {
              "role": "appMaker",
              "type": "text",
              "text": message
            }
          }
          submit(data);
        });

        //Call to the Notification API
        function submit(data) {

          var settings = {
            url: 'https://api.smooch.io/v1/apps/'+appId+'/notifications',
            headers: {"Authorization": "Bearer {{setting.JWT}}"},
            secure: true,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data)
          };

          client.request(settings).then(function(resp) {
            console.log(resp);
          });
        }
      });
  });
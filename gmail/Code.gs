function doGet(){
  
    return HtmlService.createTemplateFromFile('form')
    .evaluate()
    .setTitle('Contact Us')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
* Sends an email with message
* @param {[]} message the message to send
*/
function send(message){

  //Put your address mail
  var recipient = "user@domain.com";
  var formatMessage = "";
  
  formatMessage += "<h4 style='text-transform: capitalize; margin-bottom: 0'>Sender :</h4><div>" + message[0] + "</div>";
  formatMessage += "<h4 style='text-transform: capitalize; margin-bottom: 0'>Subject :</h4><div>" + message[2] + "</div>";
  formatMessage += "<h4 style='text-transform: capitalize; margin-bottom: 0'>Message :</h4><div>" + message[1] + "</div>";
  
  //send an email with message
  MailApp.sendEmail({
     to: recipient, 
     subject: "Contact form", 
     htmlBody: formatMessage
  });
                                                                                                   
}

/**
* Sends an automatic do not reply email after received a email from the sender
* @param {String} sender the sender email
*/
function automationReply(sender){
  var message = "<h4 style='text-transform: capitalize; margin-bottom: 0'>Thank you for getting in touch !</h4>";
  message += "<div>We appreciate you contacting us. One of our colleagues will get back to you shortly.<br>Have a great day !</div>";
  message += "<p>*** This is an automatically generated email, please do not reply ***</p>";
  MailApp.sendEmail({
    to: sender,
    subject : "Thank you for contacting us",
    htmlBody: message,
    noReply : true
  });
}

/**
* Sends the message after a submit form
* @param {[]} message
**/
function post(message){

    send(message);
    automationReply(message[0]);
}
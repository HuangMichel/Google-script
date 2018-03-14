/**
* Listing all events from today to the end of the year
* For more information on using the CalendarApp, see
* https://developers.google.com/apps-script
**/
function getListEvent(){
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("List of events");
  
  var today = new Date();
  var endDay;
  
  if(ss.getRange("I2").getValue()===""){
    endDay = new Date("01/01/2019"); //format MM/DD/YYYY
  }else{
     endDay = new Date(ss.getRange("I2").getValue());
  }
  
  /* List of events from today to endDay */
  var events = CalendarApp.getDefaultCalendar().getEvents(today, endDay);
  
  var outputRow = [];
  
  events.forEach(function(event){
    
    var outputCol = [];
    
    outputCol.push(event.getStartTime().toString().split("GMT")[0].trim());
    outputCol.push(event.getEndTime().toString().split("GMT")[0].trim());
    outputCol.push(event.getTitle());
    
    var guestList = "";
    
    event.getGuestList(true).forEach(function(guest){
      /* Gets the guest name if known else the email address */
      if(guest.getName().length==0){
        guestList += guest.getEmail() + " ";
      }else{
        guestList += guest.getName() + " ";
      }
    });
    
    outputCol.push(guestList);
    outputCol.push(event.getLocation());
    
    outputRow.push(outputCol);
  });
  
  /* Better optimization of once setValues instead of col*row times setValues for a range of values*/
  if(outputRow.length>0){
    ss.getRange(2, 1, outputRow.length, 5).setValues(outputRow);
  }
  
  ss.getRange("H3").setValue(events.length);
  ss.getRange("I1").setValue(today.toISOString().split("T")[0].trim());
  if(ss.getRange("I2").getValue()===""){
     ss.getRange("I2").setValue(endDay.toISOString().split("T")[0].trim());
  }
}

/**
* Listing all files from drive
* For more information on using the DriveApp, see
* https://developers.google.com/apps-script
**/
function getListFile(){
  var files = DriveApp.getFiles();
  var output = [];
  
  while(files.hasNext()){
    var file = files.next();
    output.push(file.getName());
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("List of files");
  
  ss.getRange(2, 1, output.length, 1).setValue(output);
}

/**
* Listing all contacts
* For more information on using the ContactApp, see
* https://developers.google.com/apps-script
**/
function getListContact(){
  
  /* List of contacts */
  var contacts = ContactsApp.getContacts();
  
  var outputRow = [];
  
  contacts.forEach(function(contact){
    
    var outputCol = [];
   
    outputCol.push(contact.getFamilyName());
    outputCol.push(contact.getGivenName());
    
    outputCol.push(contact.getEmails()[0].getAddress());
    
    if(contact.getPhones().length==0){
      outputCol.push("Not informed");
    }else{
      outputCol.push(contact.getPhones()[0].getPhoneNumber());
    }
    
    if(contact.getCompanies().length==0){
      outputCol.push("Not informed");
    }else{
      outputCol.push(contact.getCompanies()[0].getCompanyName());
    }
    
    outputRow.push(outputCol);
  });
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("List of contacts");
  
  ss.getRange(2,1, outputRow.length, 5).setValues(outputRow);

}

/**
* Listing all mails
* For more information on using the GmailApp, see
* https://developers.google.com/apps-script
**/
function getListMail(){
  
  /* List of mails */
  var mails = GmailApp.getInboxThreads();
  
  var outputRow = [];
  
  mails.forEach(function(mail){
    
    var outputCol = [];
    
    outputCol.push(mail.getLastMessageDate());
    outputCol.push(mail.getFirstMessageSubject());
    outputCol.push(mail.getMessages()[0].getFrom());
    
    outputRow.push(outputCol);
    
  });
  
  var ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("List of mails");
  
  ss.getRange(2,1, outputRow.length, 3).setValues(outputRow);
  
  ss.appendRow(["Total", mails.length]);
  ss.getRange("A"+ss.getLastRow()+":B"+ss.getLastRow()).setFontWeight("bold");
}

/**
 * Adds a custom menu to the active spreadsheet, containing a menu item
 * for invoking multiple function specified above.
 * The onOpen() function, when defined, is automatically invoked whenever the
 * spreadsheet is opened.
 * For more information on using the Spreadsheet API, see
 * https://developers.google.com/apps-script/service_spreadsheet
 */
function onOpen(){
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("Actions list")
  .addItem('Listing events', 'getListEvent')
  .addItem('Listing files', 'getListFile')
  .addItem('Listing contacts', 'getListContact')
  .addItem('Listing mails', 'getListMail')
  .addItem('Reset', 'reset')
  .addToUi();
}

/**
* Clear all contents
**/
function reset(){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheetByName("List of events").getRange("A2:E").clearContent();
  ss.getSheetByName("List of events").getRange("I1:I2").clearContent();
  ss.getSheetByName("List of events").getRange("H3").clearContent();
  ss.getSheetByName("List of files").getRange("A2:A").clearContent();
  ss.getSheetByName("List of contacts").getRange("A2:E").clearContent();
  ss.getSheetByName("List of mails").getRange("A2:C").clearContent();
  ss.getSheetByName("List of mails").getRange("A2:C").clearFormat();
}
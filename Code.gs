function doGet() {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle('ARM Invitation Generator')
      .setFaviconUrl('https://raw.githubusercontent.com/arjungupta26012002/ExcelerateResources/refs/heads/main/favicon.ico');
}

function generateMessage(formData) {
  var template = HtmlService.createTemplateFromFile('MessageTemplate');

  template.week = formData.week;
  template.internshipName = formData.internshipName;
  template.name = formData.name;

  var sessionsData = [];

  formData.sessions.forEach(function(session) {
    var selectedDate = new Date(session.tcmDate);

    var year = selectedDate.getFullYear();
    var month = selectedDate.getMonth();
    var day = selectedDate.getDate();
    var hour = parseInt(session.tcmHour);
    var minute = parseInt(session.tcmMinute);
    var ampm = session.tcmAmPm;

    if (ampm === 'PM' && hour < 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) { 
      hour = 0;
    }

    var startTimeDummy = new Date(year, month, day, hour, minute);
    var durationMinutes = parseInt(session.tcmDuration);
    var endTimeDummy = new Date(startTimeDummy.getTime() + durationMinutes * 60 * 1000);

    var formattedDayName = Utilities.formatDate(selectedDate, "Asia/Kolkata", "EEEE");
    var formattedDatePart = Utilities.formatDate(selectedDate, "Asia/Kolkata", "d'S' MMMM").replace(/(\d)(S)/, function(match, p1) {
          var n = parseInt(p1);
          if (n > 3 && n < 21) return p1 + 'th';
          switch (n % 10) {
            case 1: return p1 + 'st';
            case 2: return p1 + 'nd';
            case 3: return p1 + 'rd';
            default: return p1 + 'th';
          }
    });

    var formattedStartTime = Utilities.formatDate(startTimeDummy, "Asia/Kolkata", "h:mm a").toUpperCase().replace("AM", "A.M").replace("PM", "P.M");
    var formattedEndTime = Utilities.formatDate(endTimeDummy, "Asia/Kolkata", "h:mm a").toUpperCase().replace("AM", "A.M").replace("PM", "P.M");

    var fullDateTimeString = `${formattedDayName}, ${formattedDatePart} | ${formattedStartTime} – ${formattedEndTime} IST`;

    var rawLink = session.meetingLink;
    var curedLink = rawLink.trim();

    curedLink = curedLink.replace(/^(https?:\/\/){1,2}/i, '');
    curedLink = 'https://' + curedLink;

    sessionsData.push({
      sessionNumber: session.sessionNumber, 
      dateTime: fullDateTimeString,
      meetingLink: curedLink
    });
  });

  template.sessionsData = sessionsData; 

  return template.evaluate().getContent();
}

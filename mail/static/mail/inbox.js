document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#email-open').style.display = 'none';
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function open_mail(mail_id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-open').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  console.log(`retrieving email: ${mail_id}`);  
  fetch(`emails/${mail_id}`)
  .then(response => response.text())
  .then(text => {
      var mail = JSON.parse(text);
      document.querySelector("#email-open").innerHTML = "";
      //for (var i in mail){
        const sender =  document.createElement("div");
        const recipients =  document.createElement("div");
        const subject =  document.createElement("div");
        const timestamp =  document.createElement("div");
        const body =  document.createElement("div");
        const line =  document.createElement("hr");
        sender.innerHTML = `<b>From:</b> ${mail.sender}<br>`;
        recipients.innerHTML = `<b>To:</b> ${mail.recipients}<br>`;
        subject.innerHTML = `<b>Subject:</b> ${mail.subject}<br>`;
        timestamp.innerHTML = `<b>Timestamp:</b> ${mail.timestamp}<br>`;
        body.innerHTML = `${mail.body}<br>`;
        body.style.margin = "20px";

        const reply =  document.createElement("div");
        reply.innerHTML = `<button>Reply</button<br>`;
        reply.className = 'reply_button';
        reply.style.margin = "10px";

        reply.innerHTML = `<button>Reply</button<br>`;

        document.querySelector("#email-open").append(sender);
        document.querySelector("#email-open").append(recipients);
        document.querySelector("#email-open").append(subject);
        document.querySelector("#email-open").append(timestamp);
        document.querySelector("#email-open").append(reply);
        document.querySelector("#email-open").append(line);
        document.querySelector("#email-open").append(body);

        reply.addEventListener('click', event => {
          console.log(mail.timestamp);
          document.querySelector('#email-open').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';
          //document.querySelector('#compose-recipients').style.display = 'none';
          const recipients_filed = document.querySelector('#compose-recipients');
          recipients_filed.value=` ${mail.recipients}`;
          const subject_filed = document.querySelector('#compose-subject');
          subject_filed.value=`${mail.subject}`;
          const body_filed = document.querySelector('#compose-body');
          body_filed.value=` \n\n--------------------------------\n\n  ${mail.body}`;
          body_filed.focus();
          const sender_button = document.querySelector("#send_mail");
          sender_button.onclick = () => {
                  
            fetch('/emails', {
              method: 'POST',
              body: JSON.stringify({
                  recipients: "john@harvard.edu",
                  subject: mail.subject,
                  body: "12345"
              })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                alert(result);
                console.log(result);
            });
                return false;
          } 
        })
 });
}
function send_mail(){
  alert("ready to send");
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
        recipients: 'john@harvard.edu',
        subject: 'Meeting time',
        body: 'How about we meet tomorrow at 3pm?'
    })
  })
  .then(response => response.json())
  .then(result => {
      // Print result
      alert(result);
      console.log(result);
  });
  return false 
}

function load_mailbox(mailbox) {
  console.log(mailbox);
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-open').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';




  fetch(`emails/${mailbox}`)
  .then(response => response.text())
  .then(text => {
      var mail = JSON.parse(text);
        for (var i in mail){
       
          const message =  document.createElement("div");
          message.className = 'message';
          message.style.border="3px solid black";
          message.style.margin="10px"
          message.style.animationPlayState = "paused";
          const messageID =  document.createElement("div");
          messageID.className = 'messageID';
          messageID.innerHTML = `${mail[i].id}`;
          messageID.style.visibility='hidden'
          const messageSender =  document.createElement("div");
          messageSender.innerHTML = `${mail[i].sender}<br>`;
          messageSender.className = 'messageSender';
          const messageSubject =  document.createElement("div");
          messageSubject.innerHTML = `${mail[i].subject}<br>`;   
          const messagetimestamp =  document.createElement("div");
          messagetimestamp.innerHTML = `${mail[i].timestamp}<br>`;
          const messageHolder =  document.createElement("div");
          messageHolder.className = 'messageHolder';

          messageHolder.style.height="0px";
          messageHolder.innerHTML = `${mail[i].body}<br>`;
          messageHolder.style.animationPlayState = "paused";
          message.append(messageSender);   
          message.append(messageSubject);  
          message.append(messagetimestamp);  
          message.append(messageHolder);
          message.append(messageID);
          document.querySelector("#emails-view").append(message);
          //document.querySelector("#emails-view").append(messageSubject);
          //ocument.querySelector("#emails-view").append(messagetimestamp);
             if (mail[i].read == false ){
                //message.style.color= "black";
              }
              else{
              //message.style.color= "red";
              } 

              //document.querySelector("#emails-view").append(message);
        }
        let elements = document.querySelectorAll(".message");

        // Convert the node list into an Array so we can
        // safely use Array methods with it
        let elementsArray = Array.prototype.slice.call(elements);
        
        // Loop over the array of elements
        elementsArray.forEach(function(elem){
          // Assign an event handler
          elem.addEventListener("click", function(){

           let messageID= document.querySelectorAll(".messageID");
           // console.log(messageID[0]); 
            messageID=messageID[0].innerHTML;
            const MID= elem.querySelector(".messageID").innerHTML;
            //console.log(elem); 
            console.log(MID);
            
            const messageHolder= elem.querySelector('.messageHolder');
            
            open_mail(Number(MID));
           // this.style.backgroundColor = "#ff0";
          });
        });
  });

  

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
}
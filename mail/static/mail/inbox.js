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
        let body_cool =  mail.body.replace(/\r?\n/g, '<br />');
        body.innerHTML = `${body_cool}<br>`;
        body.style.margin = "20px";

        const reply =  document.createElement("button");
        reply.textContent ="reply";
        //reply.innerHTML = `<button type="button" class="btn btn-primary">Reply</button<br>`;
        reply.className = 'btn btn-primary';
        reply.style.margin = "10px";

        const archive =  document.createElement("button");
        archive.className = 'archive';
        archive.id='archive';
        if (mail.archived){
          archive.textContent ="Move to Inbox";
      }else {
        archive.textContent ="Archive";
      }
        //reply.innerHTML = `<button type="button" class="btn btn-primary">Reply</button<br>`;
        archive.className = 'btn btn-primary';
        archive.style.margin = "10px";
        //reply.innerHTML = `<button>Reply</button<br>`;

        document.querySelector("#email-open").append(sender);
        document.querySelector("#email-open").append(recipients);
        document.querySelector("#email-open").append(subject);
        document.querySelector("#email-open").append(timestamp);
        document.querySelector("#email-open").append(reply);
        document.querySelector("#email-open").append(archive);
        document.querySelector("#email-open").append(line);
        document.querySelector("#email-open").append(body);

        fetch(`/emails/${mail.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            read: true
          })
        })

        archive.addEventListener('click', event => { // archive button 
          const archive_status= document.querySelector("#archive").textContent;
          console.log(archive_status);
          let archived;
          if (archive_status === 'Archive'){
            console.log("qui:");
            document.querySelector("#archive").textContent = "Move to Inbox";
            archived=true;
            alert("Email archived.");
          }
          else{
            console.log("qui:");
            document.querySelector("#archive").textContent = "Archive";
            archived=false;
            alert("Email moved to Inbox.");
          }

          fetch(`/emails/${mail.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              archived: archived
            })
          })
         
                return false;
          
        })


        reply.addEventListener('click', event => { // reply button 
           
          document.querySelector('#email-open').style.display = 'none';
          document.querySelector('#compose-view').style.display = 'block';
          //document.querySelector('#compose-recipients').style.display = 'none';
          const recipients_filed = document.querySelector('#compose-recipients');
          recipients_filed.value=`${mail.sender}`;
          const subject_filed = document.querySelector('#compose-subject');
          subject_filed.value=`Re: ${mail.subject}`;
          const body_filed = document.querySelector('#compose-body');
          body_filed.value=` \r\n--------------------------------
          From: ${mail.sender} 
          To: ${mail.recipients}
          Subject:${mail.subject}

          ${mail.body}`;
         // body_filed.focus();
          const sender_button = document.querySelector("#send_mail");
          sender_button.onclick = () => {
                  
            fetch('/emails', {
              method: 'POST',
              body: JSON.stringify({
                  recipients: recipients_filed.value,
                  subject: subject_filed.value,
                  body:  body_filed.value
              })
            })
            .then(response => response.json())
            .then(result => {
                // Print result
                alert("Mail sent");
            load_mailbox('sent');
            console.log(result);
            });
           return false;
                
          } 
        })
 });
}
 

function load_mailbox(mailbox) {
 
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
          message.style.border="1px solid black";
          message.style.padding="10px"
          //message.style.margin="10px"
          message.style.animationPlayState = "paused";
          const messageID =  document.createElement("div");
          messageID.className = 'messageID';
          messageID.innerHTML = `${mail[i].id}`;
          messageID.style.visibility='hidden'
          messageID.style.height="0px";
          const messageSender =  document.createElement("div");
          messageSender.innerHTML = `<b>${mail[i].sender}</b>    `;
          messageSender.className = 'messageSender';
          const messageSubject =  document.createElement("div");
          messageSubject.innerHTML = `${mail[i].subject}<br>`;   
          const messagetimestamp =  document.createElement("div");
          messagetimestamp.className = 'messagetimestamp';
          messagetimestamp.innerHTML = `${mail[i].timestamp}`;
 
          message.append(messageSender);   
          message.append(messageSubject);  
          message.append(messagetimestamp);  
         // message.append(messageHolder);
          message.append(messageID);
          document.querySelector("#emails-view").append(message);
       
             if (mail[i].read === true ){
               
                message.style.backgroundColor = "Lightgray";
              }
              else{
              message.style.backgroundColor = "white";
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
          elem.addEventListener("mouseover", function(){
            this.style.cursor ="pointer";
          });

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
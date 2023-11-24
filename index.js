let express = require("express"); // install express
let app = express(); // create an express server-object
let port = 8080; // use port 8080
let fs = require('fs');

let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`); // run webbserver port 8080
});

app.use(express.urlencoded({ extended: true })); 


//Start page and when you log out you come here
//<form class="col-12" action="/" method="get">

/*app.get("/", function (req, res) {
    res.sendFile(__dirname + "/login.html");
  });*/


/**
 * Post
 * 1. add a guest to guests.json when click subit button
 * 2. redirect to the route guestbook.html 
 */
app.post("/addguest", function(req,res){


  let guests= fs.readFileSync("guests.json").toString();
  guests= JSON.parse(guests);// from Json to Object

  //let {name, comment}=req.body;
  let name = req.body.name;
  let comment= req.body.comment;
  let time= createFormatTimeStamp(new Date());
  console.log(time);

  guests.push({name,comment,time});// Add object to guest.json
  console.log(guests)
  req.body.name='';
  req.body.comment='';
  fs.writeFileSync("guests.json", JSON.stringify(guests));
 return res.redirect("/guestbook.html");// Redirect to guestbook

});

/**
 * Get
 * Output guest list
 *
 */

app.get("/guestbook.html",function(req,res){

     let output = fs.readFileSync("guestbook.html").toString();

//------------------Here show the guest list--------------------
      let guests = JSON.parse(fs.readFileSync("guests.json").toString());
      console.log(guests)
      let guestListHTML = createGuestListHTML(guests);// create HTML here
      console.log(guestListHTML)
    
      
      output=output.replace("<!-- ***Here printout all guest info*** -->",guestListHTML);
    
      return res.send(output);
      //console.log(output)
});

/**
 * function createGuestListHTML
 * @param {*} guests
 * @returns 
 */

function createGuestListHTML(guests) {

  let guest_html = '';
  

  for(var i=guests.length-1; i>=0; i--){
    
      guest_html+=
      `
      <div class="container p-3 box" >
        <div class="row">
          <div class="col-md-12" style="display:flex;">
           <p class="p-2">Name:</p> <p class="p-2">${guests[i].name}</p>
          </div>
          <div class="col-md-12" style="display:flex;">
          <p class="p-2">Comment:</p> <p class="p-2">${guests[i].comment}</p>
          </div>
          <div class="col-md-12" style="display:flex;">
          <p class="p-2">Time:</p> <p class="p-2">${guests[i].time}</p>
          </div>
        </div>
      </div>
    `
    
  }
  return guest_html;

}

function createFormatTimeStamp (date){
    let year = date.getFullYear();
    let month = String(date.getMonth() +1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}


app.use(express.static('public'));



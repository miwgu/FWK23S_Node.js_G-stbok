let express = require("express"); // install express
let app = express(); // create an express server-object
let port = 8080; // use port 8080
let fs = require('fs');

let httpServer = app.listen(port, function () {
  console.log(`Webbserver körs på port ${port}`); // run webbserver port 8080
});

app.use(express.urlencoded({ extended: true })); 


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

  if(name==''|| comment==''){
    let output = fs.readFileSync("guestbook.html").toString();
    output =output.replace("display: none;", "display: block;");
    let guestListHTML = createGuestListHTML(guests);// create HTML here
    output=output.replace("<!-- ***Here printout all guest info*** -->",guestListHTML);
    
    return  res.send(output)
  }

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

/**
 * function createFormatTimeStamp
 * @param {*} date 
 * @returns 
 */

function createFormatTimeStamp (date){
    let year = date.getFullYear();
    let month = String(date.getMonth() +1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    let format =`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`

return format;
}


app.use(express.static('public')); // Use css in public folder



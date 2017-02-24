//variable for the components
var myGamePiece; 
var myObstacles = [];

// a gaming area with function and canvas
function startGame() {
    myGameArea.start();
  //The object constructor called component, and make first component, called myGamePiece etc
    myGamePiece = new component( 30, 30, "red", 10, 120 ); // //(width, height, color, x, y)
}

var myGameArea = {
  canvas : document.createElement("canvas"),
    start : function() {
    this.canvas.width = 600;
        this.canvas.height = 300;
        this.context = this.canvas.getContext("2d");
       //inserts canvas as the first childnode of the <body> element.
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
       //control the component by using the arrow keys on the keyboard.  
       window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false; 
        })
    //update display 50 times per second 
        this.frameNo = 0;  
    this.interval = setInterval(updateGameArea, 20); //code, delay 
    },
//component is drawn and cleared 50 times per second: 
  clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
//component crshes with obstacle. Frames updates, 50 times per seconds, stop function to myGameArea which clears 20 milliseconds interval 
  stop: function () {
    clearInterval(this.interval);
  }
}

//The everyinterval function returns true if the current framenumber corresponds with the given interval.
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}    
//function of the object constructor component and (parameter1, parameter2, ...)
function component(width, height, color, x, y) {
  //these are the properties
    this.width = width;
    this.height = height;
    this.speedX = 0; 
    this.speedY = 0; 
    this.x = x;
    this.y = y; 
 //put the component in a update property for the updateGameArea function
    this.update = function(){
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    //position for the movement of the component
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    //component crash with obstacle
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) {
           crash = false; 
        }
        return crash;
    }
}
 //clears and updates the component and the game area
function updateGameArea() { 
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  // we must loop through every obstacle to see if there is a crash. If there is a crash, the updateGameArea function will stop, and no more drawing is done.
  for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            alert("GAME OVER!");
            return; 
        } 
    }
  myGameArea.clear();
      //The updateGameArea function counts frames and adds an obstacle for every 150th frame distance.
  myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
      //The Math.random() function returns a random integer between the specified values. The value is no lower than min (or the next integer greater than min if min isn't an integer), and is less than (but not equal to) max.
        height = Math.floor(Math.random()*(maxHeight - minHeight + 1) + minHeight);
        minGap = 50;
        maxGap = 200;
      //Getting a random integer between two values, inclusive
        gap = Math.floor(Math.random()*(maxGap - minGap + 1) + minGap);
        // width, height, colour, x, y
        myObstacles.push(new component(10, height, "green", x, 0)); //top 
        myObstacles.push(new component(10, x - height - gap, "green", x, height + gap)); //bottoe blocks
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        //creates movement - 1 does backwrd movement
        myObstacles[i].x += -1;
        //Change the property value of myObstacle.x at every update
        myObstacles[i].update();
    }
    myGamePiece.newPos();  
     //To check the red square is being drawn 50 times per second, I've changed x position (horizontal) by one pixel every time functon update the game area:
            //myGamePiece.x +=1;
          //move the component if one of the arrow keys are pressed
      if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
      if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
      if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
      if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }
    myGamePiece.update();
}

/*
* @author Boris Gallet, Benoit Rospars
* @subject Master WIC 2016 AI Project
* @
*
* @description
* The Board class describe the object representing the game board
*/

var Board = function(size,elementID){
    this.board = [];
    this.elementID = elementID;
    this.size = size;
    this.movesVector = {
      'NORTH' : { x: 0, y: -1},
      'EAST' : { x: 1, y: 0},
      'SOUTH' : { x: 0, y: 1},
      'WEST' : { x: -1, y: 0},
      'NORTHEAST' : { x: 1, y: -1},
      'NORTHWEST' : { x: -1, y: -1},
      'SOUTHEAST' : { x: 1, y: 1},
      'SOUTHWEST' : { x: -1, y: 1},
      'TAKENORTH' : { x: 0, y: -2},
      'TAKEEAST' : { x: 2, y: 0},
      'TAKESOUTH' : { x: 0, y: 2},
      'TAKEWEST' : { x: -2, y: 0},
      'TAKENORTHEAST' : { x: 2, y: -2},
      'TAKENORTHWEST' : { x: -2, y: -2},
      'TAKESOUTHEAST' : { x: 2, y: 2},
      'TAKESOUTHWEST' : { x: -2, y: 2}
    };

    this.init();
};

Board.prototype.init = function(){
    var max = this.size-1;
    var min = 0;

    for(var y=0;y<this.size;y++){
        this.board.push([]);
        for(var x=0;x<this.size;x++){
            // node coordinate
            var node = {
                'x': x,
                'y': y
            };

            // node allowed moves
            var moves = {
                'NORTH' : false,
                'EAST' : false,
                'SOUTH' : false,
                'WEST' : false,
                'NORTHEAST' : false,
                'NORTHWEST' : false,
                'SOUTHEAST' : false,
                'SOUTHWEST' : false,
                'TAKENORTH' : false,
                'TAKEEAST' : false,
                'TAKESOUTH' : false,
                'TAKEWEST' : false,
                'TAKENORTHEAST' : false,
                'TAKENORTHWEST' : false,
                'TAKESOUTHEAST' : false,
                'TAKESOUTHWEST' : false
            };


            // check if NORTHEAST and SOUTHWEST are allowed in these coordinates
            if(node.y == (-node.x+max) || node.y == (-node.x+max)-2 || node.y == (-node.x+max)+2){
              if(node.y > min && node.x < max){
                moves.NORTHEAST = true;
              }
              if(node.y < max && node.x > min){
                moves.SOUTHWEST = true;
              }
              if(node.y > min+1 && node.x < max-1){
                moves.TAKENORTHEAST = true;
              }
              if(node.y < max-1 && node.x > min+1){
                moves.TAKESOUTHWEST = true;
              }
            }

            // check if NORTHWEST and SOUTHEAST are allowed in these coordinates
            if(node.y == node.x || node.y == node.x+2 || node.y == node.x-2){
              if(node.y < max && node.x < max){
                moves.SOUTHEAST = true;
              }
              if(node.y > min && node.x > min){
                moves.NORTHWEST = true;
              }
              if(node.y < max-1 && node.x < max-1){
                moves.TAKESOUTHEAST = true;
              }
              if(node.y > min+1 && node.x > min+1){
                moves.TAKENORTHWEST = true;
              }
            }

            // check NORTH, EAST, SOUTH, WEST are allowed in these coordinates
            if(node.x < max){
              moves.EAST = true;
            }
            if(node.x > min){
              moves.WEST = true;
            }
            if(node.y > min){
              moves.NORTH = true;
            }
            if(node.y < max){
              moves.SOUTH = true;
            }
            if(node.x < max-1){
              moves.TAKEEAST = true;
            }
            if(node.x > min+1){
              moves.TAKEWEST = true;
            }
            if(node.y > min+1){
              moves.TAKENORTH = true;
            }
            if(node.y < max-1){
              moves.TAKESOUTH = true;
            }


            // add moves to the node
            node.moves = moves;

            // add node to the board
            this.board[y].push(node);
        }
    }

    this.drawBoard();

};

Board.prototype.drawBoard = function(){

  var element = document.getElementById(this.elementID);
  var width = element.getBoundingClientRect().width-160;
  var height = element.getBoundingClientRect().height-160;

  for(var y=0;y<this.size;y++){
    for(var x=0;x<this.size;x++){
      var node = this.board[y][x];
      var coordX = node.x*(width/(this.size-1))+80;
      var coordY = node.y*(height/(this.size-1))+80;

      node.coordX = coordX;
      node.coordY = coordY;

      svg.circle(coordX, coordY, 18).attr({fill:"grey"});

      var moves = this.board[y][x].moves;


      for(var key in moves) {
        if(moves[key]){
          var coordX_2 = coordX + this.movesVector[key].x * ( (width-width*0.2) / (this.size-1) );
          var coordY_2 = coordY + this.movesVector[key].y * ( (height-height*0.2) / (this.size-1) );
          svg.line(coordX, coordY, coordX_2, coordY_2)
              .attr({strokeWidth:5,stroke:"grey",strokeLinecap:"round"});
        }
      }
    }
  }
};

Board.prototype.getNearestNode = function(coordX,coordY){
  var minDistance = 99999;
  var nearestNode = null;

  for(var y=0;y<this.size;y++){
    for(var x=0;x<this.size;x++){
      var node = this.board[y][x];
      var distance = Math.sqrt(Math.pow(node.coordX-coordX,2)+Math.pow(node.coordY-coordY,2));
      if(distance < minDistance){
        minDistance = distance;
        nearestNode = node;
      }
    }
  }

  return nearestNode;
};

Board.prototype.movePawnFromNode = function(oldNode,newNode){
  newNode.pawn = oldNode.pawn;
  delete oldNode.pawn;
};

Board.prototype.getNodeByCoordinates = function(coordX,coordY){
  var node = null;

  for(var y=0;y<this.size;y++){
    for(var x=0;x<this.size;x++){
      var n = this.board[y][x];

      if(n.coordX == coordX && n.coordY == coordY){
        node = n;
      }
    }
  }

  return node;
};

// return the direction if the move is allowed else return false
Board.prototype.getPathBetweenNodes = function(oldNode,newNode){
  var moveX = newNode.x - oldNode.x;
  var moveY = newNode.y - oldNode.y;
  for(var k in this.movesVector){
    if(this.movesVector[k].x == moveX && this.movesVector[k].y == moveY && oldNode.moves[k]){
      return k;
    }
  }
  return false;
};

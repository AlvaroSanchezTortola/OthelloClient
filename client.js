var tournamentID=12;
var user_name='asanchez';
var socket = require('socket.io-client')('http://192.168.1.149:3000');

var movimiento=0; 
var myID;
var playerTurnID;
var otherID;
var board_2D;
var resul_mov=[];

socket.on('connect', function(){
  socket.emit('signin', {
    user_name: user_name,
    tournament_id: tournamentID,
    user_role: 'player'
  });
});

socket.on('ok_signin', function(){
  console.log("Successfully signed in!");
});


socket.on('ready', function(data){
  board_2D = [];
  var possible_moves = []
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  myID=data.player_turn_id;
  otherID=getOponent(myID);
  console.log("Player: "+playerTurnID)
  var board = data.board;
  //printTablero1D(board);
  board_2D = convertTo2D(board);
  console.log(board_2D);

  var valid_moves = getValidMoves(board_2D, playerTurnID)
  console.log("Valid moves: "+valid_moves);

 /* var movimientos = applyMovements(board_2D, valid_moves, playerTurnID);
  if (movimientos == null){
    movimientos = board_2D.slice();
  }
  console.log("Haciendo movs",movimientos);*/
  // TODO: Your logic / user input here
  
  //var mov = montecarlo(board, playerTurnID);
  //var mov = valid_moves[Math.floor(Math.random() * valid_moves.length)];
  var mov =minimax(board_2D,-100000,100000);
  if(mov == null){
    var mov = valid_moves[Math.floor(Math.random() * valid_moves.length)];
  }

  console.log("Movimiento -> "+mov);
  console.log(" ");

  socket.emit('play', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: mov //aqui va lo que hay que mandar
  });
});

socket.on('finish', function(data){
  var gameID = data.game_id;
  var playerTurnID = data.player_turn_id;
  var winnerTurnID = data.winner_turn_id;
  var board = data.board;

  console.log("** Winner: "+winnerTurnID+" **");
  // TODO: Your cleaning board logic here
  console.log("Everythings done!");
  console.log(" ");

  socket.emit('player_ready', {
    tournament_id: tournamentID,
    player_turn_id: playerTurnID,
    game_id: gameID
  });
});

function getOponent(playerTurnID){
  if (playerTurnID===1){
    return 2;
  }else{
    return 1;
  }
}

function getValidMoves(board, playerTurnID){
  let valid_moves = [];
  let oponent = getOponent(playerTurnID);
  let i;
  let j;
  // board 
  for (var row = 0; row < board.length; row++) {
    for (var col = 0; col < 8; col++) {
      if(board[row][col]==playerTurnID){ // buscar mis fichas
        
        // arriba
        i = row -1;
        if(i>=0 && board[i][col]== oponent){
          i = i-1;
          while(i>=0 && board[i][col]== oponent){
            i = i-1;
          }
          if(i>=0 && board[i][col]== 0){
            if(!valid_moves.includes(i*8+col)){
              valid_moves.push(i*8+col);
            }
          }
        }

        // abajo 
        i = row +1;
        if(i<8 && board[i][col]== oponent){
          i = i+1;
          while(i<8 && board[i][col]== oponent){
            i = i+1;
          }
          if(i<8 && board[i][col]== 0){
            if(!valid_moves.includes(i*8+col)){
              valid_moves.push(i*8+col);
            }
          }
        }
      
        // izquierda
        i = col - 1;
        if(i>=0 && board[row][i]== oponent){
          i = i-1;
          while(i>=0 && board[row][i]== oponent){
            i = i-1;
          }
          if(i>=0 && board[row][i]== 0){
            if(!valid_moves.includes(row*8+i)){
              valid_moves.push(row*8+i);
            }
          }
        }

        // derecha
        i = col + 1;
        if(i<8 && board[row][i]== oponent){
          i = i+1;
          while(i<8 && board[row][i]== oponent){
            i = i+1;
          }
          if(i<8 && board[row][i]== 0){
            if(!valid_moves.includes(row*8+i)){
              valid_moves.push(row*8+i);
            }
          }
        }

        // diagonal arriba derecha
        i = row - 1;
        j = col + 1;
        if(i>=0 && j<8 && board[i][j]== oponent){
          i = i-1;
          j = j+1;
          while(i>=0 && j<8 && board[i][j]== oponent){
            i = i-1;
            j = j+1;
          }
          if(i>=0 && j<8 && board[i][j]== 0){
            if(!valid_moves.includes(i*8+j)){
              valid_moves.push(i*8+j);
            }
          }
        }

        // diagonal arriba izquierda
        i = row - 1;
        j = col - 1;
        if(i>=0 && j>=0 && board[i][j]== oponent){
          i = i-1;
          j = j-1;
          while(i>=0 && j>=0 && board[i][j]== oponent){
            i = i-1;
            j = j-1;
          }
          if(i>=0 && j>=0 && board[i][j]== 0){
            if(!valid_moves.includes(i*8+j)){
              valid_moves.push(i*8+j);
            }
          }
        }

        // diagonal abajo derecha
        i = row + 1;
        j = col + 1;
        if(i<8 && j<8 && board[i][j]== oponent){
          i = i+1;
          j = j+1;
          while(i<8 && j<8 && board[i][j]== oponent){
            i = i+1;
            j = j+1;
          }
          if(i<8 && j<8 && board[i][j]== 0){
            if(!valid_moves.includes(i*8+j)){
              valid_moves.push(i*8+j);
            }
          }
        }

         // diagonal abajo izquierda
        i = row + 1;
        j = col - 1;
        if(j>=0 && i<8 && board[i][j]== oponent){
          i = i+1;
          j = j-1;
          while(j>=0 && i<8 && board[i][j]== oponent){
            i = i+1;
            j = j-1;
          }
          if(j>=0 && i<8 && board[i][j]== 0){
            if(!valid_moves.includes(i*8+j)){
              valid_moves.push(i*8+j);
            }
          }
        }


      }
    }
  }
  return valid_moves;
}

function montecarlo(board, playerTurnID){
  
  while (true){
    var rand = Math.floor(Math.random() * 64); //random para probar
    if(board[rand]==0){
      return rand;
    }
  }
}

function convertTo2D(board){
  var board_2D =[];
  var aux=[];
  //convertir el tablero 
  for(var i=0;i<board.length;i++){
    if(i%8==0&&i!=0){
      board_2D.push(aux);
        aux=[];
    }
    aux.push(board[i]);
    if(i==board.length-1){
      board_2D.push(aux);
    }
  }
  return board_2D;
}

function printTablero1D(board){
  //-----Print board as table-------
    var s = ""; 
    for(var j = 0; j < 8; j += 1) {
      for(var i = 0; i < 8; i += 1) {
        s += board[i+j] + " ";
      }
      s += "\n";
    }
    console.log(s)
  //--------------------------------
}



function evaluation(estado){
  //Heuristica
  return coinParity(estado) +mobility(estado)+corners(estado)+stability(estado);

}
function coinParity(estado){
  var myCoins=0; 
  var otherCoins=0; 
  for(var i=0; i<estado.length;i++){
    for(var j=0;j<estado.length;j++){
      if(estado[i][j]!=0){
        if(estado[i][j]==myID){
          myCoins++;
        }else{
          otherCoins++;
        }
      }
    }
  }
  return 100.0*(myCoins-otherCoins)/(myCoins + otherCoins);
}
function mobility(estado){
  //My moves
  var Mmovs=getValidMoves(estado,myID);
  //Other
  var Omovs=getValidMoves(estado,otherID);
  if(Mmovs.length + Omovs.length!=0){
    return 100.0* (Mmovs.length- Omovs.length)/(Mmovs.length + Omovs.length);
  }else{
    return 0;
  }
}
function corners(estado){
  var Mcornes=0; 
  var Ocornes=0; 
  if(estado[0][0]==myID){
    Mcornes++;
  }
  if(estado[7][0]==myID){
    Mcornes++;
  }
  if(estado[7][7]==myID){
    Mcornes++;
  }
  if(estado[0][7]==myID){
    Mcornes++;
  }
  if(estado[0][0]==otherID){
    Ocornes++;
  }
  if(estado[7][0]==otherID){
    Ocornes++;
  }
  if(estado[7][7]==otherID){
    Ocornes++;
  }
  if(estado[0][7]==otherID){
    Ocornes++;
  }
  if(Mcornes+Ocornes!=0){
    return 100.0*(Mcornes - Ocornes)/(Mcornes+Ocornes);
  }else{
    return 0; 
  }
}

function stability(estado){
  var pesos=[
  [ 4,-3, 2, 2, 2, 2,-3, 4],
  [-3,-4,-1,-1,-1,-1,-4,-3],
  [ 2,-1, 1, 0, 0, 1,-1, 2],
  [ 2,-1, 0, 1, 1, 0,-1, 2],
  [ 2,-1, 0, 1, 1, 0,-1, 2],
  [ 2,-1, 1, 0, 0, 1,-1, 2],
  [-3,-4,-1,-1,-1,-1,-4,-3],
  [ 4,-3, 2, 2, 2, 2,-3, 4]];
  var Msta=0; 
  var Osta=0; 
  for(var i=0; i<estado.length;i++){
    for(var j=0;j<estado.length;j++){
      if(estado[i][j]==myID){
        Msta=Msta+pesos[i][j];        
      }
      if(estado[i][j]==otherID){
        Osta=Osta+pesos[i][j];
      }
    }
  }
  return 100.0*(Msta-Osta)/(Msta + Osta);
}

function apliMove(mov,estado,playerID){
  //movimiento cambia el estado
  var fichasCambiar=[];
  estado[Math.floor(mov/8)][mov%8]=playerID;
  for(var i=0;i<resul_mov.length;i++){
    if(resul_mov[i][0]==mov){
      fichasCambiar=fichasCambiar.concat(resul_mov[i][1]);
    }
  }
  for(var i=0; i<fichasCambiar.length;i++){
    estado[Math.floor(fichasCambiar[i]/8)][fichasCambiar[i]%8]=playerID;
  }
  return estado;

}

function minimax(estado,alpha,betha){
  var val=valorMax(estado,0,alpha,betha)[0];
  //console.log(val);
  return val;
}

function valorMax(estado,depth,alpha,betha){
  //console.log("calculando")
  if(depth==5){
    return evaluation(estado);
  }
  var mayor_val=-10000; 
  var mejor_accion; 
  var resultado; 
  var utilidad; 
  var movimientos=getValidMoves(estado,myID);
  for(var i=0;i<movimientos.length;i++){
    resultado=apliMove(movimientos[i],estado,myID);
    utilidad=valorMin(resultado,depth+1,alpha,betha)[1];
    if(utilidad>mayor_val){
      mayor_val=utilidad;
      mejor_accion=movimientos[i];
    }
    if(mayor_val>=betha){
      return [mejor_accion, mayor_val];
    }
    if(mayor_val> alpha){
      alpha=mayor_val;
    }
  }
  return [mejor_accion, mayor_val];
}


function valorMin(estado,depth,alpha,betha){
  if(depth==5){
    return evaluation(estado);
  }
  var menor_val=10000; 
  var mejor_accion; 
  var resultado; 
  var utilidad; 
  var movimientos=getValidMoves(estado,otherID);
  for(var i=0;i<movimientos.length;i++){
    resultado=apliMove(movimientos[i],estado,otherID);
    utilidad=valorMax(resultado,depth+1,alpha,betha)[1];
    if(utilidad<menor_val){
      menor_val=utilidad;
      mejor_accion=movimientos[i];
    }
    if(menor_val<=alpha){
      return [mejor_accion, menor_val];
    }
    if(menor_val> betha){
      betha=menor_val;
    }
  }
  return [mejor_accion, menor_val];
  
}

function applyMovements(board_2D_entrada, possible_moves, playerTurnID){
  let new_board = board_2D_entrada.slice();
  let aux = [];
  let oponent = getOponent(playerTurnID);

  let mov = possible_moves[Math.floor(Math.random() * possible_moves.length)];

  new_board[Math.floor(mov/8)][mov%8]=playerTurnID;

  let row = Math.floor(mov/8);
  let col = mov%8;
  console.log("x,y: ", row, col);
  // arriba
  let i = row -1;
  if(i>=0 && new_board[i][col]== oponent){
    aux.push(i*8+col);
    i = i-1;
    
    while(i>=0 && new_board[i][col]== oponent){
      aux.push(i*8+col);
      i = i-1;
    }

    if(i>=0 && new_board[i][col]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i>=0 && new_board[i][col]== 0){
      aux = [];
    }
  }

  // abajo 
  i = row +1;
  if(i<8 && new_board[i][col]== oponent){
    aux.push(i*8+col);
    i = i+1;
    
    while(i<8 && new_board[i][col]== oponent){
      aux.push(i*8+col);
      i = i+1;
      
    }
    if(i<8 && new_board[i][col]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i<8 && new_board[i][col]== 0){
      aux = [];
    }
  }
  
  // izquierda
  i = col - 1;
  if(i>=0 && new_board[row][i]== oponent){
    aux.push(row*8+i);
    i = i-1;
    
    while(i>=0 && new_board[row][i]== oponent){
      aux.push(row*8+i);
      i = i-1;
      
    }
    if(i>=0 && new_board[row][i]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i>=0 && new_board[row][i]== 0){
      aux = [];
    }
  }

  // derecha
  i = col + 1;
  if(i<8 && new_board[row][i]== oponent){
    aux.push(row*8+i);
    i = i+1;
    
    while(i<8 && new_board[row][i]== oponent){
      aux.push(row*8+i);
      i = i+1;
      
    }
    if(i<8 && new_board[row][i]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i<8 && new_board[row][i]== 0){
      aux = [];
    }
  }

  // diagonal arriba derecha
  i = row - 1;
  j = col + 1;
  if(i>=0 && j<8 && new_board[i][j]== oponent){
    aux.push(i*8+j);
    i = i-1;
    j = j+1;
    while(i>=0 && j<8 && new_board[i][j]== oponent){
      aux.push(i*8+j);
      i = i-1;
      j = j+1;
    }
    if(i>=0 && j<8 && new_board[i][j]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i>=0 && j<8 && new_board[i][j]== 0){
      aux = [];
    }
  }

  // diagonal arriba izquierda
  i = row - 1;
  j = col - 1;
  if(i>=0 && j>=0 && new_board[i][j]== oponent){
    aux.push(i*8+j);
    i = i-1;
    j = j-1;
    while(i>=0 && j>=0 && new_board[i][j]== oponent){
      aux.push(i*8+j);
      i = i-1;
      j = j-1;
    }
    if(i>=0 && j>=0 && new_board[i][j]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i>=0 && j>=0 && new_board[i][j]== 0){
      aux = [];
    }
  }

  // diagonal abajo derecha
  i = row + 1;
  j = col + 1;
  if(i<8 && j<8 && new_board[i][j]== oponent){
    aux.push(i*8+j);
    i = i+1;
    j = j+1;
    while(i<8 && j<8 && new_board[i][j]== oponent){
      aux.push(i*8+j);
      i = i+1;
      j = j+1;
    }
    if(i<8 && j<8 && new_board[i][j]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }else if(i<8 && j<8 && new_board[i][j]== 0){
      aux = [];
    }
  }

   // diagonal abajo izquierda
  i = row + 1;
  j = col - 1;
  if(j>=0 && i<8 && new_board[i][j]== oponent){
    aux.push(i*8+j);
    i = i+1;
    j = j-1;
    while(j>=0 && i<8 && new_board[i][j]== oponent){
      aux.push(i*8+j);
      i = i+1;
      j = j-1;
    }
    if(j>=0 && i<8 && new_board[i][j]== playerTurnID){
      for (var k = 0; k < aux.length; k++) {
        new_board[Math.floor(aux[k]/8)][aux[k]%8]=playerTurnID;
      }
      console.log("aux salida: ",aux);
      return new_board;
    }
    return null;
  }


}
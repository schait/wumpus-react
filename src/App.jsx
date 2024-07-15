import { useState } from 'react'
import Cell from './Cell';
import { CELL_TYPES, VISIBILITY, mod } from './game';
import lodash from 'lodash';

function shootArrow(map, x, y, dx, dy) {
  if (map[y][x].cellType === CELL_TYPES.NE_SW) {
    // right -> down, down -> right, up -> left, left -> up. dy = dx, dx = dy
    const newX = mod(x + dy, 10);
    const newY = mod(y + dx, 6);
    console.log(`${x}, ${y} is a NE-SW tunnel. Came from ${mod(x-dx, 10)}, ${mod(y-dy, 6)}, going to ${newX}, ${newY}`);
    return shootArrow(map, newX, newY, dy, dx);
  }
  else if (map[y][x].cellType === CELL_TYPES.NW_SE) {
    // right -> up, down -> left, up -> right, left -> down. dy = -dx, dx = -dy
    const newX = mod(x - dy, 10);
    const newY = mod(y - dx, 6);
    console.log(`${x}, ${y} is a NW-SE tunnel. Came from ${mod(x-dx, 10)}, ${mod(y-dy, 6)}, going to ${newX}, ${newY}`);
    return shootArrow(map, newX, newY, -dy, -dx);
  }
  else {
    // We hit a room
    console.log(`Shot hits room ${x}, ${y}, type ${map[y][x].cellType}`);
    const success = map[y][x].cellType === CELL_TYPES.WUMPUS_ROOM;
    console.log("success", success);
    return success;
  }
}

export default function App(props) {
  const [map, setMap] = useState(props.map);
  const [currentX, setCurrentX] = useState(props.currentX);
  const [currentY, setCurrentY] = useState(props.currentY);
  const [canMoveX, setCanMoveX] = useState({"-1": true, 1: true});
  const [canMoveY, setCanMoveY] = useState({"-1": true, 1: true});
  const [currentDX, setCurrentDX] = useState();
  const [currentDY, setCurrentDY] = useState();
  const [shootMode, setShootMode] = useState(false);
  const [win, setWin] = useState(false);
  const [missed, setMissed] = useState(false);
  const [allVisible, setAllVisible] = useState(false);
  const roomIndices = props.roomIndices;
  console.log(roomIndices)

  function activateShoot() {
    if (map[currentY][currentX].cellType == CELL_TYPES.NW_SE || map[currentY][currentX].cellType == CELL_TYPES.NE_SW) {
      alert("Must be in a room to shoot!");
    }
    else {
      setShootMode(true);
    }
  }

  function shoot(dx, dy) {
    const success = shootArrow(map, mod(currentX+dx, 10), mod(currentY+dy, 6), dx, dy);
    console.log("Success", success);
    if (success) {
      setWin(true);
    }
    else {
      setMissed(true);
    }
  }

  function batSnatch(fromX, fromY) {
    const possibleRoomIndices = roomIndices.filter(i => fromY * 10 + fromX !== i && !map[Math.floor(i / 10)][i % 10].bat);
    const newRoomIndex = lodash.sample(possibleRoomIndices);
    const toY = Math.floor(newRoomIndex / 10);
    const toX = newRoomIndex % 10;
    console.log(`Bat snatch from ${fromX} ${fromY} to ${toX} ${toY}`);
    map[fromY][fromX].bat = false;
    map[toY][toX].bat = true;
    map[toY][toX].batAwake = false;
    setCurrentY(toY);
    setCurrentX(toX);
    map[toY][toX].visibility = VISIBILITY.VISIBLE;
  }

  function move(dx, dy) {
    console.log("Move", dx, dy, "Can Move:", canMoveX, canMoveY);
    let newMoveInfo, newX, newY;
    if (dx && canMoveX[dx]) {
      newX = mod(currentX + dx, 10);
      newY = currentY;
      setCurrentX(newX);
      if (map[newY][newX].cellType === CELL_TYPES.NE_SW) {
        console.log("Moving into NE/SW");
        if (dx > 0) {
          newMoveInfo = {x: {"-1": true, 1: false}, y: {"-1": false, 1: true}, vis: VISIBILITY.VISIBLE_SOUTH}
        }
        else {
          newMoveInfo = {x: {"-1": false, 1: true}, y: {"-1": true, 1: false}, vis: VISIBILITY.VISIBLE_NORTH}
        }
      }
      else if (map[newY][newX].cellType === CELL_TYPES.NW_SE) {
        console.log("Moving into NW/SE");
        if (dx > 0) {
          newMoveInfo = {x: {"-1": true, 1: false}, y: {"-1": true, 1: false}, vis: VISIBILITY.VISIBLE_NORTH}
        }
        else {
          newMoveInfo = {x: {"-1": false, 1: true}, y: {"-1": false, 1: true}, vis: VISIBILITY.VISIBLE_SOUTH}
        }
      }
      else {
        console.log("Moving into room");
        newMoveInfo = {x: {"-1": true, 1: true}, y: {"-1": true, 1: true}, vis: VISIBILITY.VISIBLE}
      }
    }
    else if (dy && canMoveY[dy]) {
      newY = mod(currentY + dy, 6);
      newX = currentX;
      setCurrentY(newY);
      if (map[newY][newX].cellType === CELL_TYPES.NE_SW) {
        console.log("Moving into NE/SW");
        if (dy < 0) {
          newMoveInfo = {x: {"-1": true, 1: false}, y: {"-1": false, 1: true}, vis: VISIBILITY.VISIBLE_SOUTH}
        }
        else {
          newMoveInfo = {x: {"-1": false, 1: true}, y: {"-1": true, 1: false}, vis: VISIBILITY.VISIBLE_NORTH}
        }
      }
      else if (map[newY][newX].cellType === CELL_TYPES.NW_SE) {
        console.log("Moving into NW/SE");
        if (dy > 0) {
          newMoveInfo = {x: {"-1": true, 1: false}, y: {"-1": true, 1: false}, vis: VISIBILITY.VISIBLE_NORTH}
        }
        else {
          newMoveInfo = {x: {"-1": false, 1: true}, y: {"-1": false, 1: true}, vis: VISIBILITY.VISIBLE_SOUTH}
        }
      }
      else {
        console.log("Moving into room");
        newMoveInfo = {x: {"-1": true, 1: true}, y: {"-1": true, 1: true}, vis: VISIBILITY.VISIBLE}
      }
    }
    else {
      console.log("Can't move", dx, dy);
      return;
    }
    setCanMoveX(newMoveInfo.x);
    setCanMoveY(newMoveInfo.y);
    setCurrentDX(dx);
    setCurrentDY(dy);
    if (map[newY][newX].visibility === VISIBILITY.HIDDEN || map[newY][newX].visibility === newMoveInfo.vis) {
      map[newY][newX].visibility = newMoveInfo.vis;
    }
    else {
      map[newY][newX].visibility = VISIBILITY.VISIBLE;
    }
    if (map[newY][newX].bat) {
      if (!map[newY][newX].batAwake) {
        map[newY][newX].batAwake = true;
      }
      else {
        console.log(`SUPER BAT SNATCH! from ${newX} ${newY}`);
        batSnatch(newX, newY);
      }
    }
  }

  let rows = [];
  for (let y = 0; y < 6; y++) {
    let cells = [];
    for (let x = 0; x < 10; x++) {
      cells.push(
        <Cell
          key={y*10 + x}
          cellType={map[y][x].cellType}
          active={x === currentX && y === currentY}
          lastMove={{dx: currentDX, dy: currentDY}}
          visibility={allVisible || map[y][x].visibility}
          bat={map[y][x].bat}
          batAwake={map[y][x].batAwake}
        />)
    }
    rows.push(<div key={'r' + y} className='parent'>{cells}</div>)
  }

  const fellInPit = map[currentY][currentX].cellType === CELL_TYPES.PIT_ROOM
  const eaten = map[currentY][currentX].cellType === CELL_TYPES.WUMPUS_ROOM && !win;

  if (win || missed || fellInPit || eaten) {
    console.log("Game over", win, missed, fellInPit, eaten)
    let message;
    if (win) {
      message = "You got the Wumpus! You win!";
    }
    else if (missed) {
      message = "You missed your shot! You lose.";
    }
    else if (fellInPit) {
      message = "You fell in a pit! You lose."
    }
    else {
      message = "Eaten by the Wumpus! You lose.";
    }
    return (
      <div id="container">
        <div id="game">{rows}</div>
        <div id="gameover">
          <p>{message}</p>
          <br/>
          <button style={{marginLeft: fellInPit ? "100px" : "140px"}} onClick={() => setAllVisible(true)}>View map</button>
          <br/><br/>
          <button style={{marginLeft: fellInPit ? "100px" : "140px"}} onClick={() => window.location.href = ""}>Play again</button>
        </div>
      </div>
    );
  }
  else if (shootMode) {
    return (
      <div id="container">
        <div id="game">{rows}</div>
        <div id="buttons">
          <p>Click to shoot!</p>
          <br/>
          <button className="shoot" id="up-button" onClick={() => shoot(0, -1)}>Up</button>
          <br/><br/>
          <button className="shoot" id="left-button" onClick={() => shoot(-1, 0)}>Left</button>
          <button className="shoot" id="right-button" onClick={() => shoot(1, 0)}>Right</button>
          <br/><br/>
          <button className="shoot" id="down-button" onClick={() => shoot(0, 1)}>Down</button>
          <br/><br/><br/><br/>
          <button id="cancel-button" onClick={() => setShootMode(false)}>Cancel</button>
        </div>
      </div>
    );
  }
  else {
    return (
      <div id="container">
        <div id="game">{rows}</div>
        <div id="buttons">
          <p>Click to move.</p>
          <br/>
          <button id="up-button" onClick={() => move(0, -1)}>Up</button>
          <br/><br/>
          <button id="left-button" onClick={() => move(-1, 0)}>Left</button>
          <button id="right-button" onClick={() => move(1, 0)}>Right</button>
          <br/><br/>
          <button id="down-button" onClick={() => move(0, 1)}>Down</button>
          <br/><br/><br/><br/>
          <button id="shoot-button" onClick={activateShoot}>Shoot</button>
        </div>
      </div>
    );
  }
}

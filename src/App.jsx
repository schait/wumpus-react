import { useState } from 'react'
import Cell from './Cell';
import { CELL_TYPES, VISIBILITY, mod } from './game';

export default function App(props) {
  const [map, setMap] = useState(props.map);
  const [currentX, setCurrentX] = useState(props.currentX);
  const [currentY, setCurrentY] = useState(props.currentY);
  const [canMoveX, setCanMoveX] = useState({"-1": true, 1: true});
  const [canMoveY, setCanMoveY] = useState({"-1": true, 1: true});

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
    if (map[newY][newX].visibility === VISIBILITY.HIDDEN || map[newY][newX].visibility === newMoveInfo.vis) {
      map[newY][newX].visibility = newMoveInfo.vis;
    }
    else {
      map[newY][newX].visibility = VISIBILITY.VISIBLE;
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
          visibility={map[y][x].visibility}
          bat={map[y][x].bat}
          batAwake={false}
        />)
    }
    rows.push(<div key={'r' + y} className='parent'>{cells}</div>)
  }

  return (
    <div id="container">
      <div>{rows}</div>
      <div id="buttons">
        <button id="up-button" onClick={() => move(0, -1)}>Up</button>
        <br/><br/><br/>
        <button id="left-button" onClick={() => move(-1, 0)}>Left</button>
        <button id="right-button" onClick={() => move(1, 0)}>Right</button>
        <br/><br/><br/>
        <button id="down-button" onClick={() => move(0, 1)}>Down</button>
      </div>
    </div>
  );
}

import { useState } from 'react'
import { CELL_TYPES, VISIBILITY } from './game';

export default function Cell(props) {

  const {cellType, active, visibility, bat} = props;

  let backgroundImage;
  let foregroundImage = '';
  if (cellType === CELL_TYPES.NE_SW) {
    if (visibility === VISIBILITY.VISIBLE_NORTH) {
      backgroundImage = "../images/ne.png"
    }
    else if (visibility === VISIBILITY.VISIBLE_SOUTH) {
      backgroundImage = "../images/sw.png"
    }
    else {
      backgroundImage = "../images/ne-sw.png";
    }
  }
  else if (cellType === CELL_TYPES.NW_SE) {
    if (visibility === VISIBILITY.VISIBLE_NORTH) {
      backgroundImage = "../images/nw.png"
    }
    else if (visibility === VISIBILITY.VISIBLE_SOUTH) {
      backgroundImage = "../images/se.png"
    }
    else {
      backgroundImage = "../images/nw-se.png";
    }
  }
  else if (cellType === CELL_TYPES.SAFE_ROOM || cellType === CELL_TYPES.WUMPUS_ROOM) {
    backgroundImage = "../images/safe.png";
  }
  else if (cellType === CELL_TYPES.BLOOD_ROOM) {
    backgroundImage = "../images/blood.png";
  }
  else if (cellType === CELL_TYPES.SLIME_ROOM) {
    backgroundImage = "../images/slime.png";
  }
  else if (cellType === CELL_TYPES.BLOOD_SLIME_ROOM) {
    backgroundImage = "../images/blood-slime.png";
  }
  else if (cellType === CELL_TYPES.PIT_ROOM) {
    backgroundImage = "../images/pit.png";
  }

  if (cellType === CELL_TYPES.WUMPUS_ROOM) {
    foregroundImage = "../images/wumpus.png";
  }
  else if (active) {
    foregroundImage = "../images/player.png";
  }
  else if (bat) {
    foregroundImage = "../images/bat.png"
  }

  const style = {
    backgroundImage: `url(${backgroundImage})`,
    opacity: visibility === VISIBILITY.HIDDEN ? 0.2 : 1
  }

  return (
    <div className='child' style={style}>
      {foregroundImage ? <img src={foregroundImage}/> : ''}
    </div>
  )
}
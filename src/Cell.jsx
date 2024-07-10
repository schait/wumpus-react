import { CELL_TYPES, VISIBILITY } from './game';

function choosePlayerImage(cellType, lastMoveDX, lastMoveDY) {
  if (cellType === CELL_TYPES.NE_SW) {
    if (lastMoveDX === 1 || lastMoveDY === -1) {
      return "../images/player-sw.png";
    }
    else {
      return "../images/player-ne.png";
    }
  }
  else if (cellType === CELL_TYPES.NW_SE) {
    if (lastMoveDX === 1 || lastMoveDY === 1) {
      return "../images/player-nw.png";
    }
    else {
      return "../images/player-se.png";
    }
  }
  else {
    return "../images/player.png";
  }
}

export default function Cell(props) {

  const {cellType, lastMove, active, visibility, bat} = props;

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
    foregroundImage = active ? "../images/eaten.png" : "../images/wumpus.png";
  }
  else if (bat) {
    foregroundImage = active ? "../images/player+bat.png" : "../images/bat.png";
  }
  else if (active) {
    foregroundImage = choosePlayerImage(cellType, lastMove.dx, lastMove.dy);
  }


  const style = {
    backgroundImage: `url(${backgroundImage})`,
    opacity: visibility === VISIBILITY.HIDDEN ? 0 : 1
  }

  return (
    <div className='child' style={style}>
      {foregroundImage ? <img src={foregroundImage}/> : ''}
    </div>
  )
}
import { CELL_TYPES, VISIBILITY } from './game';

function choosePlayerImage(cellType, lastMoveDX, lastMoveDY) {
  if (cellType === CELL_TYPES.NE_SW) {
    if (lastMoveDX === 1 || lastMoveDY === -1) {
      return "/player-sw.png";
    }
    else {
      return "/player-ne.png";
    }
  }
  else if (cellType === CELL_TYPES.NW_SE) {
    if (lastMoveDX === 1 || lastMoveDY === 1) {
      return "/player-nw.png";
    }
    else {
      return "/player-se.png";
    }
  }
  else {
    return "/player.png";
  }
}

export default function Cell(props) {

  const {cellType, lastMove, active, visibility, bat} = props;

  let backgroundImage;
  let foregroundImage = '';
  if (cellType === CELL_TYPES.NE_SW) {
    if (visibility === VISIBILITY.VISIBLE_NORTH) {
      backgroundImage = "/ne.png"
    }
    else if (visibility === VISIBILITY.VISIBLE_SOUTH) {
      backgroundImage = "/sw.png"
    }
    else {
      backgroundImage = "/ne-sw.png";
    }
  }
  else if (cellType === CELL_TYPES.NW_SE) {
    if (visibility === VISIBILITY.VISIBLE_NORTH) {
      backgroundImage = "/nw.png"
    }
    else if (visibility === VISIBILITY.VISIBLE_SOUTH) {
      backgroundImage = "/se.png"
    }
    else {
      backgroundImage = "/nw-se.png";
    }
  }
  else if (cellType === CELL_TYPES.SAFE_ROOM || cellType === CELL_TYPES.WUMPUS_ROOM) {
    backgroundImage = "/safe.png";
  }
  else if (cellType === CELL_TYPES.BLOOD_ROOM) {
    backgroundImage = "/blood.png";
  }
  else if (cellType === CELL_TYPES.SLIME_ROOM) {
    backgroundImage = "/slime.png";
  }
  else if (cellType === CELL_TYPES.BLOOD_SLIME_ROOM) {
    backgroundImage = "/blood-slime.png";
  }
  else if (cellType === CELL_TYPES.PIT_ROOM) {
    backgroundImage = "/pit.png";
  }

  if (cellType === CELL_TYPES.WUMPUS_ROOM) {
    foregroundImage = active ? "/eaten.png" : "/wumpus.png";
  }
  else if (bat) {
    foregroundImage = active ? "/player+bat.png" : "/bat.png";
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
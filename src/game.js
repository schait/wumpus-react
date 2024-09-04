import lodash from 'lodash';

const NUM_ROOMS = 30;

export const CELL_TYPES = Object.freeze({
  NE_SW: 0,
  NW_SE: 1,
  SAFE_ROOM: 2,
  BLOOD_ROOM: 3,
  SLIME_ROOM: 4,
  BLOOD_SLIME_ROOM: 5,
  PIT_ROOM: 6,
  WUMPUS_ROOM: 7,
});

export const VISIBILITY = Object.freeze({
  HIDDEN: "hidden",
  VISIBLE: "visible",
  VISIBLE_NORTH: "vis_north",
  VISIBLE_SOUTH: "vis_south"
});

// Necessary to take the modulus without getting negative results
export function mod(n, m) {
  return ((n % m) + m) % m;
}

// Necessary for an array of arrays because Array.includes uses reference equality
function includes(deepArray, arr) {
  return deepArray.some(a => arr.every((v, i) => v === a[i]));
}

// For debugging purposes only.
function arrayToSpaceSeparatedString(arr) {
  let str = ""
  for (const item of arr) {
    str = str + item + " "
  }
  return str;
}

function convertToGrid(linearMap) {
  // Convert 60-length array into 10x6 2D array
  const map = [
    linearMap.slice(0, 10),
    linearMap.slice(10, 20),
    linearMap.slice(20, 30),
    linearMap.slice(30, 40),
    linearMap.slice(40, 50),
    linearMap.slice(50, 60)
  ];
  for (let i = 0; i < 6; i++) {
    //console.log(arrayToSpaceSeparatedString(map[i]))
  }
  return map;
}

function assignBloodRooms(map, x, y, dx, dy, seen, distance=1) {
  //console.log("x", x, "y", y, "Seen", seen);
  if (includes(seen, [x, y])) {
    //console.log(`${x}, ${y} already seen!`);
    return;
  }
  else if (map[y][x] === CELL_TYPES.NE_SW) {
    // right -> down, down -> right, up -> left, left -> up. dy = dx, dx = dy
    const newX = mod(x + dy, 10);
    const newY = mod(y + dx, 6);
    //console.log(`${x}, ${y} is a NE-SW tunnel. Came from ${mod(x-dx, 10)}, ${mod(y-dy, 6)}, going to ${newX}, ${newY}`);
    assignBloodRooms(map, newX, newY, dy, dx, seen, distance);
  }
  else if (map[y][x] === CELL_TYPES.NW_SE) {
    // right -> up, down -> left, up -> right, left -> down. dy = -dx, dx = -dy
    const newX = mod(x - dy, 10);
    const newY = mod(y - dx, 6);
    //console.log(`${x}, ${y} is a NW-SE tunnel. Came from ${mod(x-dx, 10)}, ${mod(y-dy, 6)}, going to ${newX}, ${newY}`);
    assignBloodRooms(map, newX, newY, -dy, -dx, seen, distance);
  }
  else {
    seen.push([x, y]);
    // We hit a room
    if (map[y][x] === CELL_TYPES.PIT_ROOM) {
      //console.log(`${x}, ${y} is a PIT! No blood here. Distance: ${distance}`);
    }
    else {
      //console.log(`${x}, ${y} is a blood room. Distance: ${distance}`);
      map[y][x] = CELL_TYPES.BLOOD_ROOM;
    }
    if (distance < 2) {
      assignBloodRooms(map, mod(x+1, 10), y, 1, 0, seen, distance + 1);
      assignBloodRooms(map, x, mod(y+1, 6), 0, 1, seen, distance + 1);
      assignBloodRooms(map, mod(x-1, 10), y, -1, 0, seen, distance + 1);
      assignBloodRooms(map, x, mod(y-1, 6), 0, -1, seen, distance + 1);
    }
  }
}

function assignSlimeRooms(map, x, y, dx, dy) {
  if (map[y][x] === CELL_TYPES.NE_SW) {
    // right -> down, down -> right, up -> left, left -> up. dy = dx, dx = dy
    const newX = mod(x + dy, 10);
    const newY = mod(y + dx, 6);
    //console.log(`${x}, ${y} is a NE-SW tunnel. Came from ${mod(x-dx, 10)}, ${mod(y-dy, 6)}, going to ${newX}, ${newY}`);
    assignSlimeRooms(map, newX, newY, dy, dx);
  }
  else if (map[y][x] === CELL_TYPES.NW_SE) {
    // right -> up, down -> left, up -> right, left -> down. dy = -dx, dx = -dy
    const newX = mod(x - dy, 10);
    const newY = mod(y - dx, 6);
    //console.log(`${x}, ${y} is a NW-SE tunnel. Came from ${mod(x-dx, 10)}, ${mod(y-dy, 6)}, going to ${newX}, ${newY}`);
    assignSlimeRooms(map, newX, newY, -dy, -dx);
  }
  else {
    // We hit a room
    if (map[y][x] === CELL_TYPES.PIT_ROOM) {
      //console.log(`${x}, ${y} is a PIT! Plenty of slime already.`);
    }
    else if (map[y][x] === CELL_TYPES.WUMPUS_ROOM) {
      //console.log(`${x}, ${y} is the WUMPUS! No slime here.`);
    }
    else if (map[y][x] === CELL_TYPES.BLOOD_ROOM || map[y][x] === CELL_TYPES.BLOOD_SLIME_ROOM) {
      //console.log(`${x}, ${y} is a blood-slime room.`);
      map[y][x] = CELL_TYPES.BLOOD_SLIME_ROOM;
    }
    else {
      //console.log(`${x}, ${y} is a slime room.`);
      map[y][x] = CELL_TYPES.SLIME_ROOM;
    }
  }
}

function finalizeMap(map, batIndices) {
  // Convert map to a 2D array of objects with properties bat, active, visibility.
  let safeRoomIndices = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 10; x++) {
      if (map[y][x] === CELL_TYPES.SAFE_ROOM && !batIndices.includes(y*10 + x)) {
        safeRoomIndices.push(y*10 + x);
      }
    }
  }
  let startRoomIndex = lodash.sample(safeRoomIndices);
  const startX = startRoomIndex % 10;
  const startY = Math.floor(startRoomIndex / 10);


  let finalMap = [[0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0], [0,0,0,0,0,0]];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 10; x++) {
      let active = y === startY && x === startX
      finalMap[y][x] = {
        'cellType': map[y][x],
        'active': active,
        'visibility': active ? VISIBILITY.VISIBLE : VISIBILITY.HIDDEN,
        'bat': false,
        'batAwake': false
      }
    }
  }

  for (let i = 0; i < 2; i++) {
    const batX = batIndices[i] % 10;
    const batY = Math.floor(batIndices[i] / 10);
    finalMap[batY][batX]['bat'] = true;
  }

  return {'map': finalMap, 'currentX': startX, 'currentY': startY};
}


export function setupGame() {
  const indices = Array.from(Array(60).keys());
  const roomIndices = lodash.sampleSize(indices, NUM_ROOMS);
  const wumpusIndex = roomIndices[0];
  const pitIndices = [roomIndices[1], roomIndices[2]];
  const batIndices = [roomIndices[3], roomIndices[4]];
  //console.log(`Wumpus at ${wumpusIndex}, pits at ${pitIndices}`);

  let linearMap = new Array(60).fill(-1);
  for (const i of roomIndices) {
    linearMap[i] = CELL_TYPES.SAFE_ROOM;
  }
  linearMap[wumpusIndex] = CELL_TYPES.WUMPUS_ROOM;
  linearMap[pitIndices[0]] = CELL_TYPES.PIT_ROOM;
  linearMap[pitIndices[1]] = CELL_TYPES.PIT_ROOM;
  for (let i = 0; i < 60; i++) {
    if (linearMap[i] === -1) {
      linearMap[i] = Math.random() < 0.5 ? CELL_TYPES.NW_SE : CELL_TYPES.NE_SW;
    }
  }

  const map = convertToGrid(linearMap);
  const wumpusX = wumpusIndex % 10;
  const wumpusY = Math.floor(wumpusIndex / 10);
  //console.log(`Starting at ${wumpusX}, ${wumpusY}`);
  assignBloodRooms(map, mod(wumpusX+1, 10), wumpusY, 1, 0, [[wumpusX, wumpusY]]);
  assignBloodRooms(map, wumpusX, mod(wumpusY+1, 6), 0, 1, [[wumpusX, wumpusY]]);
  assignBloodRooms(map, mod(wumpusX-1, 10), wumpusY, -1, 0, [[wumpusX, wumpusY]]);
  assignBloodRooms(map, wumpusX, mod(wumpusY-1, 6), 0, -1, [[wumpusX, wumpusY]]);

  for (let i = 0; i < 6; i++) {
    //console.log(arrayToSpaceSeparatedString(map[i]))
  }

  for (let i = 0; i < 2; i++) {
    const pitX = pitIndices[i] % 10;
    const pitY = Math.floor(pitIndices[i] / 10);
    //console.log(`Starting at ${pitX}, ${pitY}`);
    assignSlimeRooms(map, mod(pitX+1, 10), pitY, 1, 0);
    assignSlimeRooms(map, pitX, mod(pitY+1, 6), 0, 1);
    assignSlimeRooms(map, mod(pitX-1, 10), pitY, -1, 0);
    assignSlimeRooms(map, pitX, mod(pitY-1, 6), 0, -1);
  }

  for (let i = 0; i < 6; i++) {
    //console.log(arrayToSpaceSeparatedString(map[i]));
  }

  const finalMapInfo = finalizeMap(map, batIndices);
  finalMapInfo.roomIndices = roomIndices;
  //console.log("Final map info", finalMapInfo)
  return finalMapInfo;
}



setupGame();
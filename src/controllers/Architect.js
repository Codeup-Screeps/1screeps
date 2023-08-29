class Architect {
  constructor(room) {
    this.room = room;
    // startSpawn is the first spawn in the room
    this.startSpawn = this.room.find(FIND_MY_SPAWNS)[0];
    this.rcl = this.room.controller.level;
    this.bunkerExits = [];
  }
  run() {
    switch (this.rcl) {
      case 1:
        this.bunkerPhase1();
        break;
      case 2:
        this.bunkerPhase2();
        break;
      case 3:
        this.bunkerPhase3();
        break;
      default:
        break;
    }
  }
  bunkerPhase1() {
    // create first line of roads in a square
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y - 1, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y + 1, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 3, this.startSpawn.pos.y + 2, STRUCTURE_ROAD);

    // add container
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y + 2, STRUCTURE_CONTAINER);

    // create second line of roads in a square
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y + 4, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y + 5, STRUCTURE_ROAD);

    // create third line of roads in a square
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y + 4, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 3, this.startSpawn.pos.y + 2, STRUCTURE_ROAD);

    // create fourth line of roads in a square
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y + 1, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y, STRUCTURE_ROAD);
  }
  bunkerPhase2() {
    this.bunkerPhase1();
    // build new box
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y - 2, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y - 3, STRUCTURE_ROAD);

    // second line of roads
    this.room.createConstructionSite(this.startSpawn.pos.x + 3, this.startSpawn.pos.y - 2, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 4, this.startSpawn.pos.y - 1, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 5, this.startSpawn.pos.y, STRUCTURE_ROAD);

    // third line of roads
    this.room.createConstructionSite(this.startSpawn.pos.x + 4, this.startSpawn.pos.y + 1, STRUCTURE_ROAD);

    // add extensions
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y - 1, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y - 2, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y - 1, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x + 3, this.startSpawn.pos.y - 1, STRUCTURE_EXTENSION);

    // add container
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y + 2, STRUCTURE_CONTAINER);
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y + 4, STRUCTURE_CONTAINER);

    // add roads for inner box for faster travel between extensions
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y + 2, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);

    // second extension box (prepping for phase 3)
    this.room.createConstructionSite(this.startSpawn.pos.x - 4, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 5, this.startSpawn.pos.y + 4, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 4, this.startSpawn.pos.y + 5, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 3, this.startSpawn.pos.y + 6, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y + 7, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y + 6, STRUCTURE_ROAD);

    // third extension box
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y - 2, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y - 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 3, this.startSpawn.pos.y - 2, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 4, this.startSpawn.pos.y - 1, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 5, this.startSpawn.pos.y, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 4, this.startSpawn.pos.y + 1, STRUCTURE_ROAD);

    // fourth extension box
    this.room.createConstructionSite(this.startSpawn.pos.x + 4, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 5, this.startSpawn.pos.y + 4, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 4, this.startSpawn.pos.y + 5, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 3, this.startSpawn.pos.y + 6, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 2, this.startSpawn.pos.y + 7, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y + 6, STRUCTURE_ROAD);

    // north road connector
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y - 4, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y - 4, STRUCTURE_ROAD);
    // add this point as a bunker exit point
    this.bunkerExits.push(new RoomPosition(this.startSpawn.pos.x, this.startSpawn.pos.y - 5, this.room.name));
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y - 4, STRUCTURE_ROAD);

    // west road connector
    this.room.createConstructionSite(this.startSpawn.pos.x - 6, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x - 6, this.startSpawn.pos.y + 2, STRUCTURE_ROAD);
    // add this point as a bunker exit point
    this.bunkerExits.push(new RoomPosition(this.startSpawn.pos.x - 6, this.startSpawn.pos.y + 2, this.room.name));
    this.room.createConstructionSite(this.startSpawn.pos.x - 6, this.startSpawn.pos.y + 1, STRUCTURE_ROAD);

    // east road connector
    this.room.createConstructionSite(this.startSpawn.pos.x + 6, this.startSpawn.pos.y + 1, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x + 6, this.startSpawn.pos.y + 2, STRUCTURE_ROAD);
    // add this point as a bunker exit point
    this.bunkerExits.push(new RoomPosition(this.startSpawn.pos.x + 6, this.startSpawn.pos.y + 2, this.room.name));
    this.room.createConstructionSite(this.startSpawn.pos.x + 6, this.startSpawn.pos.y + 3, STRUCTURE_ROAD);

    // south road connector
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y + 8, STRUCTURE_ROAD);
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y + 8, STRUCTURE_ROAD);
    // add this point as a bunker exit point
    this.bunkerExits.push(new RoomPosition(this.startSpawn.pos.x, this.startSpawn.pos.y + 8, this.room.name));
    this.room.createConstructionSite(this.startSpawn.pos.x + 1, this.startSpawn.pos.y + 8, STRUCTURE_ROAD);

    // add last container
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y - 2, STRUCTURE_CONTAINER);

    // build roads to sources
    this.buildRoadsToSources();
    this.buildRoadToRC();
  }
  bunkerPhase3() {
    this.bunkerPhase2();
    // add a tower
    this.room.createConstructionSite(this.startSpawn.pos.x, this.startSpawn.pos.y + 1, STRUCTURE_TOWER);
    // add extensions
    this.room.createConstructionSite(this.startSpawn.pos.x - 1, this.startSpawn.pos.y - 1, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y - 2, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y - 1, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x - 2, this.startSpawn.pos.y, STRUCTURE_EXTENSION);
    this.room.createConstructionSite(this.startSpawn.pos.x - 3, this.startSpawn.pos.y - 1, STRUCTURE_EXTENSION);
  }
  buildRoadsToSources() {
    // build roads to sources
    const sources = this.room.find(FIND_SOURCES);
    for (let source of sources) {
      let path = this.determineBestBunkerExit(source);
      this.buildRoadAlongPath(path);
    }
  }
  buildRoadToRC() {
    // build road to room controller
    let path = this.determineBestBunkerExit(this.room.controller);
    this.buildRoadAlongPath(path);
  }
  determineBestBunkerExit(destination) {
    // find the bunker exit with least cost from the PathFinder object
    let bestExit = this.bunkerExits.reduce((min, exit) => {
      let path = PathFinder.search(exit, destination);
      if (path.cost < min.cost) {
        return path;
      } else {
        return min;
      }
    }, PathFinder.search(this.bunkerExits[0], destination));
    return bestExit;
  }
  buildRoadAlongPath(path) {
    for (let pos of path.path) {
      this.room.createConstructionSite(pos.x, pos.y, STRUCTURE_ROAD);
    }
  }
}

export default Architect;

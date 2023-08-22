class CreepBase {
  constructor(creep) {
    this.creep = creep;
  }
  addRoadSites() {
    // if current position doesn't have a road, create construction site
    if (
      this.creep.room.lookForAt(
        LOOK_STRUCTURES,
        this.creep.pos.x,
        this.creep.pos.y
      ).length == 0 &&
      this.creep.room.lookForAt(
        LOOK_CONSTRUCTION_SITES,
        this.creep.pos.x,
        this.creep.pos.y
      ).length == 0
    ) {
      this.creep.room.createConstructionSite(
        this.creep.pos.x,
        this.creep.pos.y,
        STRUCTURE_ROAD
      );
    }
  }
}

module.exports = CreepBase;

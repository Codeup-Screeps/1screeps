import CreepBase from "./CreepBase";

class RolePawn extends CreepBase {
  /** @param {Creep} creep **/
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    // if (this.creep.memory.botherBillie) {
    //   this.creep.say("🗡️ ATTACK!");
    // }
    // not within 5 tiles of "Staging" flag
    if (!this.creep.memory.botherBillie && this.creep.pos.findInRange(FIND_FLAGS, 5, { filter: (flag) => flag.name === "Staging" }).length === 0) {
      this.creep.say("🫡 FALL IN!");
    }

    if (this.creep.memory.botherBillie === true) {
      const targetRoomName = this.findHostileFlagRoomName();

      // Check if the creep is at the border of a room
      if (this.creep.pos.x === 49 || this.creep.pos.x === 0 || this.creep.pos.y === 49 || this.creep.pos.y === 0) {
        this.creep.moveTo(new RoomPosition(25, 25, targetRoomName));
        return;
      }

      // Check for enemies only if the creep isn't set to move to another room
      const target = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        if (this.creep.attack(target) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
        }
        if (Game.time % 10 === 0) {
          this.creep.say("DIE BILLIE!");
        }
        return;
      }
    } else {
      const target = this.creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
      if (target) {
        if (this.creep.attack(target) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(target);
        }
        return;
      }
      // move to staging flag
      const flag = this.creep.pos.findClosestByRange(FIND_FLAGS, {
        filter: (flag) => flag.name === "Staging",
      });
      if (flag) {
        if (this.creep.pos.getRangeTo(flag) > 1) {
          this.creep.moveTo(flag);
        }
      }
    }
  }
  findHostileFlagRoomName() {
    for (let flagName in Game.flags) {
      if (flagName.startsWith("hostile_")) {
        const parts = flagName.split("_");
        return parts.length > 1 ? parts[1] : null;
      }
    }
    return null; // Return null if no matching flag is found
  }
}

export default RolePawn;

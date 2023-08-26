'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

class CreepBase {
  constructor(creep) {
    this.creep = creep;
  }
  addRoadSites() {
    // if current position doesn't have a road, create construction site
    if (
      this.creep.room.lookForAt(LOOK_STRUCTURES, this.creep.pos.x, this.creep.pos.y).length == 0 &&
      this.creep.room.lookForAt(LOOK_CONSTRUCTION_SITES, this.creep.pos.x, this.creep.pos.y).length == 0
    ) {
      this.creep.room.createConstructionSite(this.creep.pos.x, this.creep.pos.y, STRUCTURE_ROAD);
    }
  }
  performUpgradeRole() {
    if (this.creep.upgradeController(this.creep.room.controller) == ERR_NOT_IN_RANGE) {
      // Move to it
      this.creep.moveTo(this.creep.room.controller, {
        visualizePathStyle: { stroke: "#ffffff" },
        // ignoreCreeps: true,
        reusePath: 1,
      });
    } else {
      // check if there are screeps behind it
      const behind = this.creep.pos.findInRange(FIND_MY_CREEPS, 1);
      // if there are, move closer to the controller to give them room
      if (behind.length > 0) {
        this.creep.moveTo(this.creep.room.controller, {
          visualizePathStyle: { stroke: "#ffffff" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      }
    }
  }
  performRepairRole() {
    // Repairing logic
    let structuresToRepair = this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.structureType != STRUCTURE_WALL,
    });
    // filter out ramparts if they are below 50k hits
    structuresToRepair = structuresToRepair.filter((structure) => structure.structureType != STRUCTURE_RAMPART || structure.hits > 50000);
    structuresToRepair.sort((a, b) => a.hits - b.hits); // Repair the most damaged first

    if (structuresToRepair.length > 0) {
      // Non road structures
      const nonRoadStructuresToRepair = structuresToRepair.filter((structure) => structure.structureType != STRUCTURE_ROAD);
      // Non road structures with less than half hits
      const nonRoadStructuresToRepairLessThanHalf = nonRoadStructuresToRepair.filter((structure) => structure.hits < structure.hitsMax / 2);
      if (nonRoadStructuresToRepairLessThanHalf.length > 0) {
        structuresToRepair = nonRoadStructuresToRepairLessThanHalf;
      }

      if (this.creep.repair(structuresToRepair[0]) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(structuresToRepair[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      }
      return true;
    } else {
      // No structures to repair, so consider other tasks or stay idle
      // e.g., creep.moveTo(Game.flags["IdleFlag"]);
      return false;
    }
  }
  collectFromContainers() {
    const containers = this.creep.room.find(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store[RESOURCE_ENERGY] > 0,
    });

    if (containers.length > 0) {
      const closestContainer = this.creep.pos.findClosestByPath(containers);
      if (this.creep.withdraw(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(closestContainer, {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
        return true; // Exit early if we're moving to a container or storage
      }
    }
    return false;
  }
  depositToContainer() {
    const containers = this.creep.room.find(FIND_STRUCTURES, {
      filter: (s) => (s.structureType == STRUCTURE_CONTAINER || s.structureType == STRUCTURE_STORAGE) && s.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });

    if (containers.length > 0) {
      const closestContainer = this.creep.pos.findClosestByPath(containers);
      if (this.creep.transfer(closestContainer, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(closestContainer, {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
        return true; // Exit early if we're moving to a container or storage
      }
    }
    return false;
  }
  collectFromGround() {
    // try to collect dropped energy
    const droppedEnergy = this.creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });

    const closestDroppedEnergy = this.creep.pos.findClosestByRange(droppedEnergy);

    if (closestDroppedEnergy) {
      if (this.creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
        this.creep.moveTo(closestDroppedEnergy, {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      }
      return true;
    }
    return false;
  }
  transferEnergyToExtensions() {
    // assist haulers by transferring energy from containers to extensions
    const extensions = this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    if (extensions.length > 0) {
      // if creep has energy at all, then transfer, otherwise collect
      if (this.creep.store.getUsedCapacity() > 0) {
        if (this.creep.transfer(extensions[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(extensions[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
      } else {
        const collectingFromContainers = this.collectFromContainers();
        if (collectingFromContainers) {
          return true;
        }
      }
      return true;
    } else {
      return false;
    }
  }
  transferEnergyToTowers() {
    // assist haulers by transferring energy from containers to towers
    let towers = this.creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
    });
    if (towers.length > 0) {
      // if creep has capacity, collect from containers
      if (this.creep.store.getFreeCapacity() > 0) {
        const collectingFromContainers = this.collectFromContainers();
        if (collectingFromContainers) {
          return true;
        }
        const collectingFromGround = this.collectFromGround();
        if (collectingFromGround) {
          return true;
        }
      }
      // sort towers by energy level
      towers = towers.sort((a, b) => a.store.getFreeCapacity(RESOURCE_ENERGY) - b.store.getFreeCapacity(RESOURCE_ENERGY));
      if (this.creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(towers[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
        return true;
      }
    } else {
      return false;
    }
  }
}

class RoleHarvester extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // Initialize harvester memory if not done
    if (this.creep.memory.settled === undefined) {
      this.creep.memory.settled = false;
    }

    // If the harvester is settled, try to harvest without moving
    if (this.creep.memory.settled) {
      const source = this.creep.pos.findClosestByRange(FIND_SOURCES);
      if (source && this.creep.harvest(source) == ERR_NOT_IN_RANGE) {
        // If no active source in range, unset the settled flag
        this.creep.memory.settled = false;
      }
      return; // Exit early to prevent movement
    }

    // Find sources in the room
    const sources = this.creep.room.find(FIND_SOURCES);

    // Filter sources based on the number of settled harvesters around them
    const availableSources = sources.filter((source) => {
      const positions = [
        [source.pos.x - 1, source.pos.y - 1],
        [source.pos.x, source.pos.y - 1],
        [source.pos.x + 1, source.pos.y - 1],
        [source.pos.x - 1, source.pos.y],
        [source.pos.x + 1, source.pos.y],
        [source.pos.x - 1, source.pos.y + 1],
        [source.pos.x, source.pos.y + 1],
        [source.pos.x + 1, source.pos.y + 1],
      ];

      let settledHarvesters = 0;

      for (let pos of positions) {
        const creepsAtPos = this.creep.room.lookForAt(
          LOOK_CREEPS,
          pos[0],
          pos[1]
        );
        for (let creepAtPos of creepsAtPos) {
          if (
            creepAtPos.memory.settled &&
            creepAtPos.memory.role === "harvester"
          ) {
            settledHarvesters++;
          }
        }
      }
      return settledHarvesters < 1; // Choose sources with fewer than this amount of settled harvesters
    });

    // Find the closest available source to the creep
    const closestAvailableSource =
      this.creep.pos.findClosestByRange(availableSources);

    if (closestAvailableSource) {
      const harvestResult = this.creep.harvest(closestAvailableSource);

      if (harvestResult == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(closestAvailableSource, {
          visualizePathStyle: { stroke: "#ffaa00" },
          //   ignoreCreeps: true,
          reusePath: 1,
        });
      } else if (harvestResult == OK) {
        // Check if the harvester is adjacent to the source
        if (this.creep.pos.isNearTo(closestAvailableSource.pos)) {
          this.creep.memory.settled = true;
        }
      }
    }
  }
}

class RoleUpgrader extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // this.addRoadSites();
    // If the creep is upgrading and is empty
    if (this.creep.memory.upgrading && this.creep.store[RESOURCE_ENERGY] == 0) {
      // Set upgrading to false and say so
      this.creep.memory.upgrading = false;
      this.creep.say("🔄 harvest");
    }
    // Otherwise if the creep is not upgrading but is full
    else if (!this.creep.memory.upgrading && this.creep.store.getFreeCapacity() == 0) {
      // Set upgrading to true and say so
      this.creep.memory.upgrading = true;
      this.creep.say("⚡ upgrade");
    }

    // This is having the creep operate based on the upgrading state

    // If the creep is upgrading
    if (this.creep.memory.upgrading) {
      // Move to and upgrade the controller
      this.performUpgradeRole();
    } else {
      // try to withdraw from containers or storage
      if (this.collectFromContainers()) {
        return;
      }
      // try to collect dropped energy
      if (this.collectFromGround()) {
        return;
      }
    }
  }
}

class RoleHauler extends CreepBase {
  /**
   * @param {Creep} creep
   */
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    this.switchModes();
    // If collecting
    if (!this.creep.memory.hauling) {
      // First check if there is extra dropped energy around the spawn
      if (this.collectingAroundSpawn()) {
        return;
      }
      // move toward creep.memory.source
      if (this.collectFromHarvester()) {
        return;
      }

      this.collectFromHarvester();
    } else {
      // Find spawns in the room that aren't full
      const spawns = this.creep.room.find(FIND_MY_SPAWNS, {
        filter: (spawn) => spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (spawns.length > 0) {
        // Find the closest spawn
        const closestSpawn = this.creep.pos.findClosestByRange(spawns);

        // Try to transfer energy to the spawn. If it's not in range
        if (this.creep.transfer(closestSpawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestSpawn, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find extensions in the room that aren't full
      const extensions = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (extensions.length > 0) {
        // Find the closest extension
        const closestExtension = this.creep.pos.findClosestByRange(extensions);

        // Try to transfer energy to the extension. If it's not in range
        if (this.creep.transfer(closestExtension, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestExtension, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find towers in the room that are not below 50% energy
      const towers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_TOWER && structure.energy < 500,
      });
      if (towers.length > 0) {
        // Try to transfer energy to the tower. If it's not in range
        if (this.creep.transfer(towers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(towers[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find containers in the room that aren't full
      const containers = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (containers.length > 0) {
        // Find the closest container
        const closestContainer = this.creep.pos.findClosestByRange(containers);

        // Try to transfer energy to the container. If it's not in range
        if (this.creep.transfer(closestContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestContainer, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // Find storage in the room that isn't full
      const storage = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_STORAGE && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0,
      });
      if (storage.length > 0) {
        // Find the closest storage
        const closestStorage = this.creep.pos.findClosestByRange(storage);

        // Try to transfer energy to the storage. If it's not in range
        if (this.creep.transfer(closestStorage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          // Move to it
          this.creep.moveTo(closestStorage, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      } else {
        // if no containers, move to spawn and drop energy
        const spawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (this.creep.transfer(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(spawn, {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        } else {
          this.creep.drop(RESOURCE_ENERGY);
          // head back toward source and wait
          this.creep.memory.hauling = false;
          this.creep.say("🔄 collect");
        }
      }
    }
  }
  switchModes() {
    if (this.creep.memory.hauling && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.hauling = false;
      this.creep.say("🔄 collect");
    }
    if (!this.creep.memory.hauling && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.hauling = true;
      this.creep.say("📦 haul");
    }
  }
  collectingAroundSpawn() {
    const spawn = this.creep.pos.findClosestByRange(FIND_MY_SPAWNS);
    const spawnDroppedEnergy = spawn.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });
    // if there is dropped energy around it and it's not full
    if (spawnDroppedEnergy.length > 0 && spawn.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
      // try to pick it up
      if (this.creep.pickup(spawnDroppedEnergy[0]) == ERR_NOT_IN_RANGE) {
        // move to it
        this.creep.moveTo(spawnDroppedEnergy[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
        return true;
      }
      return true;
    }
    return false;
  }
  collectFromHarvester() {
    const droppedEnergy = this.creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: (resource) => resource.resourceType == RESOURCE_ENERGY,
    });
    if (droppedEnergy.length > 0) {
      // largest energy first
      droppedEnergy.sort((a, b) => b.amount - a.amount);
      if (this.creep.pickup(droppedEnergy[0]) == ERR_NOT_IN_RANGE) {
        this.creep.moveTo(droppedEnergy[0], {
          visualizePathStyle: { stroke: "#ffaa00" },
          reusePath: 1,
        });
      }
      return true;
    }
  }
}

class Builder extends CreepBase {
  /** @param {Creep} creep **/
  constructor(creep) {
    super(creep);
    this.repairWalls = false;
  }
  run() {
    // Switching between modes
    if (this.creep.memory.building && this.creep.store[RESOURCE_ENERGY] === 0) {
      this.creep.memory.building = false;
      this.creep.say("🔄 collect");
    }
    if (!this.creep.memory.building && this.creep.store.getFreeCapacity() === 0) {
      this.creep.memory.building = true;
      this.creep.say("🚧 build");
    }

    if (this.creep.memory.building) {
      // find construction sites
      let targets = this.creep.room.find(FIND_CONSTRUCTION_SITES);
      // remove ramparts that have over 50k hits
      targets = targets.filter((target) => target.structureType !== STRUCTURE_RAMPART || target.hits < 50000);
      if (targets.length > 0) {
        if (this.creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          this.creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
            // ignoreCreeps: true,
            reusePath: 1,
          });
        }
        return;
      }

      // if walls to repair
      const wallsToRepair = this.creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => structure.structureType == STRUCTURE_WALL && structure.hits < structure.hitsMax && structure.hits < 1000000,
      });

      if (wallsToRepair.length > 0 && this.repairWalls) {
        wallsToRepair.sort((a, b) => a.hits - b.hits); // Repair the most damaged first
        if (this.creep.repair(wallsToRepair[0]) === ERR_NOT_IN_RANGE) {
          this.creep.moveTo(wallsToRepair[0], {
            visualizePathStyle: { stroke: "#ffaa00" },
            reusePath: 1,
          });
        }
        return;
      }
      // If no construction sites, perform backup roles
      if (this.transferEnergyToExtensions()) {
        return;
      }
      if (this.transferEnergyToTowers()) {
        return;
      }
      if (this.depositToContainer()) {
        return;
      }
      //   if (this.transferEnergyToExtensions()) {
      //     return;
      //   }
      //   this.performRepairRole();
    } else {
      // try to withdraw from containers or storage
      if (this.collectFromContainers()) {
        return;
      }
      // try to collect dropped energy
      if (this.collectFromGround()) {
        return;
      }
    }
  }
}

class Repairer extends CreepBase {
  /** @param {Creep} creep **/
  constructor(creep) {
    super(creep);
  }
  run() {
    // Switching between modes
    if (
      this.creep.memory.repairing &&
      this.creep.store[RESOURCE_ENERGY] === 0
    ) {
      this.creep.memory.repairing = false;
      this.creep.say("🔄 collect");
    }
    if (
      !this.creep.memory.repairing &&
      this.creep.store.getFreeCapacity() === 0
    ) {
      this.creep.memory.repairing = true;
      this.creep.say("🔧 repair");
    }

    if (this.creep.memory.repairing) {
      this.performRepairRole();
    } else {
      // Collecting logic
      // try to withdraw from containers or storage
      if (this.collectFromContainers()) {
        return;
      }
      // try to collect dropped energy
      if (this.collectFromGround()) {
        return;
      }
    }
  }
}

/* 
This is an idea to make a controller for all creeps, to better manage them
down the road. It's not currently in use. Future ideas:
- Have the controller manage the creeps through persistent memory
- Evaluate the room and assign tasks to creeps based on the room's needs
*/
class CreepsController {
  constructor(spawn) {
    this.spawn = spawn;
    this.room = spawn.room;
    this.sources = this.getEnergySources();
    this.creeps = {
      harvesters: this.getCreepsByType("harvester"),
      haulers: this.getCreepsByType("hauler"),
      upgraders: this.getCreepsByType("upgrader"),
      builders: this.getCreepsByType("builder"),
      repairers: this.getCreepsByType("repairer"),
    };
  }
  run() {
    // this.assignHaulerSource();
    return;
  }
  assignHaulerSource() {
    // assign a designated source to each hauler in memory
    // if the hauler already has a source, leave it alone
    // otherwise, assign it to the source with the fewest haulers
    // this.creeps.haulers.forEach((hauler) => {
    //   if (hauler.memory.source) {
    //     return;
    //   }
    //   let source = _.min(this.sources, (source) => {
    //     return _.filter(
    //       this.creeps.haulers,
    //       (creep) => creep.memory.source == source.id
    //     ).length;
    //   });
    //   hauler.memory.source = source.id;
    // });
  }
  getEnergySources() {
    return this.room.find(FIND_SOURCES);
  }
  getCreepsByType(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type);
  }
}

class SpawnController {
  constructor(spawn) {
    this.spawn = spawn;
    // get a count of all creep roles
    this.harvesters = this.countCreeps("harvester");
    this.haulers = this.countCreeps("hauler");
    this.upgraders = this.countCreeps("upgrader");
    this.builders = this.countCreeps("builder");
    this.repairers = this.countCreeps("repairer");
    // count the amount of sources in the room as part of logic
    // for creep spawning
    this.sourceCount = this.spawn.room.find(FIND_SOURCES).length;
    //count extensions
    this.extensions = this.spawn.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.structureType == STRUCTURE_EXTENSION,
    }).length;
    // wait on energy to create larger creeps
    this.minBuild = 300 + (50 * this.extensions) / 3;
    this.maxBuild = 300 + (50 * this.extensions) / 2;
    // in the case of a base meltdown, let spawn create smaller creeps
    if (this.harvesters === 0 || this.haulers === 0) {
      this.minBuild = 300;
    }
    this.creepsController = new CreepsController(spawn);
  }
  run() {
    this.spawnNewCreeps();
    this.announceNewCreeps();
    this.creepsController.run();
  }
  countCreeps(type) {
    return _.filter(Game.creeps, (creep) => creep.memory.role == type).length;
  }
  spawnNewCreeps() {
    let availableEnergy = parseFloat(this.spawn.room.energyAvailable);
    if (this.minBuild > availableEnergy) {
      return;
    }
    // If there aren't enough harvesters
    if (this.harvesters < this.sourceCount) {
      // Spawn a new one

      var newName = "Harvester" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("harvester"), newName, {
        memory: { role: "harvester" },
      });
    }
    // Otherwise if there aren't enough haulers
    else if (this.haulers < 1) {
      // Spawn a new one

      var newName = "Hauler" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("hauler"), newName, {
        memory: { role: "hauler" },
      });
    }
    // Otherwise if there aren't enough builders
    else if (this.builders < 1) {
      // Spawn a new one

      var newName = "Builder" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("builder"), newName, {
        memory: { role: "builder", building: false },
      });
    }
    // Otherwise if there aren't enough repairers
    else if (this.repairers < 1) {
      // Spawn a new one
      var newName = "Repairer" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("repairer"), newName, {
        memory: { role: "repairer", repairing: false },
      });
    }
    // Otherwise if there aren't enough upgraders
    else if (this.upgraders < 1) {
      // Spawn a new one

      var newName = "Upgrader" + Game.time;
      this.spawn.spawnCreep(this.creepLoadout("upgrader"), newName, {
        memory: { role: "upgrader", upgrading: false },
      });
    }
  }
  announceNewCreeps() {
    if (this.spawn.spawning) {
      // Get the creep being spawned

      var spawningCreep = Game.creeps[this.spawn.spawning.name];

      // Visualize the role of the spawning creep above the spawn
      this.spawn.room.visual.text("🛠️" + spawningCreep.memory.role, this.spawn.pos.x + 1, this.spawn.pos.y, { align: "left", opacity: 0.8 });
    }
  }
  creepLoadout(type) {
    let availableEnergy = parseFloat(this.spawn.room.energyAvailable);
    // control the size of harvesters based on available energy
    console.log(`Building new ${type} screep.`);
    console.log(`availableEnergy: ${availableEnergy}, minBuild: ${this.minBuild}, maxBuild: ${this.maxBuild}`);
    if (availableEnergy > this.maxEnergy) {
      availableEnergy = this.maxEnergy;
    }
    const parts = {
      MOVE: 50,
      WORK: 100,
      CARRY: 50,
      ATTACK: 80,
      RANGED_ATTACK: 150,
      HEAL: 250,
      CLAIM: 600,
      TOUGH: 10,
    };
    const body = [];
    switch (type) {
      case "harvester":
        body.push(MOVE);
        availableEnergy -= parts["MOVE"];
        // harvesters mostly work, but need to replace dead ones quicker
        for (let i = 1; availableEnergy >= parts["WORK"]; i++) {
          if (i % 4 === 0) {
            body.unshift(MOVE);
            availableEnergy -= parts["MOVE"];
          } else {
            body.push(WORK);
            availableEnergy -= parts["WORK"];
          }
        }
        break;
      case "hauler":
        body.push(CARRY, CARRY, MOVE, MOVE);
        availableEnergy -= parts["CARRY"] + parts["CARRY"] + parts["MOVE"] + parts["MOVE"];
        while (availableEnergy >= parts["CARRY"] + parts["MOVE"]) {
          body.unshift(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["CARRY"] + parts["MOVE"];
        }
        break;
      case "upgrader":
        body.push(WORK, CARRY, MOVE);
        availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        while (availableEnergy >= parts["WORK"] + parts["CARRY"] + parts["MOVE"]) {
          body.unshift(WORK);
          body.push(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        }
        break;
      case "builder":
        body.push(WORK, CARRY, MOVE);
        availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        while (availableEnergy >= parts["WORK"] + parts["CARRY"] + parts["MOVE"]) {
          body.unshift(WORK);
          body.push(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        }
        break;
      case "repairer":
        body.push(WORK, CARRY, MOVE);
        availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        while (availableEnergy >= parts["WORK"] + parts["CARRY"] + parts["MOVE"]) {
          body.unshift(WORK);
          body.push(CARRY);
          body.push(MOVE);
          availableEnergy -= parts["WORK"] + parts["CARRY"] + parts["MOVE"];
        }
        break;
    }
    // const totalCost = body.reduce((total, part) => total + parts[part], 0);
    // console.log(`body: ${body}, totalCost: ${totalCost}`);
    return body;
  }
}

class Tower {
  constructor(tower) {
    this.tower = tower;
  }

  run() {
    // attack hostiles
    const target = this.tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
    if (target) {
      this.tower.attack(target);
      return;
    }
    // heal friendlies
    const friendlyTarget = this.tower.pos.findClosestByRange(FIND_MY_CREEPS, {
      filter: (creep) => creep.hits < creep.hitsMax,
    });
    if (friendlyTarget) {
      this.tower.heal(friendlyTarget);
      return;
    }
    // repair targets within range of tower
    const structureTargets = this.tower.room.find(FIND_STRUCTURES, {
      filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 150000 && structure.pos.getRangeTo(this.tower) < 20,
    });

    // sort by hits
    structureTargets.sort((a, b) => a.hits - b.hits);
    const structureTarget = structureTargets[0];
    if (structureTarget) {
      this.tower.repair(structureTarget);
      return;
    }
  }
}

// Import creep roles

function loop() {
  // Loop through each creep's name in Memory.creeps
  for (var creepName in Memory.creeps) {
    // If the creep's name isn't in Game.creeps
    if (!Game.creeps[creepName]) {
      // Remove it from the memory and log that it did so
      delete Memory.creeps[creepName];
      console.log("Clearing non-existing creep memory:", creepName);
    }
  }
  // Get spawns
  const spawns = _.filter(Game.spawns, (spawn) => spawn.my);
  // Loop through spawns
  for (let spawn of spawns) {
    // Create a new Spawn object
    new SpawnController(spawn).run();
  }

  // Loop through creep's names in Game.creeps
  for (let creepName in Game.creeps) {
    let creep = Game.creeps[creepName];

    if (creep.memory.role == "harvester") {
      new RoleHarvester(creep).run();
      continue;
    }

    if (creep.memory.role == "upgrader") {
      new RoleUpgrader(creep).run();
      continue;
    }

    if (creep.memory.role == "hauler") {
      new RoleHauler(creep).run();
      continue;
    }

    if (creep.memory.role == "builder") {
      new Builder(creep).run();
      continue;
    }

    if (creep.memory.role == "repairer") {
      new Repairer(creep).run();
      continue;
    }
    // running all creep moves
    // Pathing.runMoves();
  }
  // Loop through towers
  for (let tower of _.filter(
    Game.structures,
    (structure) => structure.structureType == STRUCTURE_TOWER
  )) {
    new Tower(tower).run();
  }
}

exports.loop = loop;
//# sourceMappingURL=main.js.map

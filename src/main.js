// Import creep roles
import RoleHarvester from "./roles/Harvester";
import RoleUpgrader from "./roles/Upgrader";
import RoleHauler from "./roles/Hauler";
import RoleBuilder from "./roles/Builder";
import RoleRepairer from "./roles/Repairer";
import SpawnController from "./controllers/Spawn";
import Tower from "./structures/Tower";
import Architect from "./controllers/Architect";
import Warlord from "./controllers/Warlord";
import CreepsController from "./controllers/Creeps";
import clearMemory from "./utils/clearMemory";

function loop() {
  // Clear memory
  clearMemory();
  // Get spawns
  const spawns = _.filter(Game.spawns, (spawn) => spawn.my);
  // Loop through spawns
  for (let spawn of spawns) {
    // Create a new Spawn object
    new SpawnController(spawn).run();
  }
  const rooms = _.filter(Game.rooms, (room) => room.controller && room.controller.my);
  if (rooms.length > 0) {
    // Loop through rooms
    for (let room of rooms) {
      // Create a new Architect object
      new CreepsController(room).run();
      new Architect(room).run();
      new Warlord(room).run();
    }
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
      new RoleBuilder(creep).run();
      continue;
    }

    if (creep.memory.role == "repairer") {
      new RoleRepairer(creep).run();
      continue;
    }
  }
  // Loop through towers
  for (let tower of _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_TOWER)) {
    new Tower(tower).run();
  }
}

export { loop };

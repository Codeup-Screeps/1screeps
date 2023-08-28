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
import profiler from "screeps-profiler";

// This line monkey patches the global prototypes.
profiler.enable();
function loop() {
  profiler.wrap(function () {
    // Loop through each creep's name in Memory.creeps
    for (var creepName in Memory.creeps) {
      // If the creep's name isn't in Game.creeps
      if (!Game.creeps[creepName]) {
        // Remove it from the memory and log that it did so
        delete Memory.creeps[creepName];
        // console.log("Clearing non-existing creep memory:", creepName);
      }
    }
    // Get spawns
    const spawns = _.filter(Game.spawns, (spawn) => spawn.my);
    // Loop through spawns
    for (let spawn of spawns) {
      // Create a new Spawn object
      new SpawnController(spawn).run();
    }
    // Loop through rooms
    for (let room of _.filter(Game.rooms, (room) => room.controller && room.controller.my)) {
      // Create a new Architect object
      new Architect(room).run();
      new Warlord(room).run();
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
  });
}

export { loop };

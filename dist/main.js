// Import creep roles
const RoleHarvester = require("role.harvester");
const RoleUpgrader = require("role.upgrader");
const RoleHauler = require("role.hauler");
const RoleBuilder = require("role.builder");
const RoleRepairer = require("role.repairer");
const SpawnController = require("controller.spawn");
const Tower = require("role.tower");

// Import pathing management
// const Pathing = require("pathing");

module.exports.loop = function () {
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
      new RoleBuilder(creep).run();
      continue;
    }

    if (creep.memory.role == "repairer") {
      new RoleRepairer(creep).run();
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
};

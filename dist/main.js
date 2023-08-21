// Import creep roles
const RoleHarvester = require("role.harvester");
const RoleUpgrader = require("role.upgrader");
const RoleHauler = require("role.hauler");
const RoleBuilder = require("role.builder");

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

  // Get counts for creeps of each role
  let harvesters = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "harvester"
  );
  let upgraders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "upgrader"
  );
  let haulers = _.filter(Game.creeps, (creep) => creep.memory.role == "hauler");
  let builders = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == "builder"
  );

  // If there aren't enough harvesters

  if (harvesters.length < 3) {
    // Spawn a new one

    var newName = "Harvester" + Game.time;
    Game.spawns["Spawn1"].spawnCreep([WORK, WORK, MOVE], newName, {
      memory: { role: "harvester" },
    });
  }

  // Otherwise if there aren't enough haulers
  else if (haulers.length < 2) {
    // Spawn a new one

    var newName = "Hauler" + Game.time;
    Game.spawns["Spawn1"].spawnCreep([CARRY, MOVE, CARRY, MOVE], newName, {
      memory: { role: "hauler" },
    });
  }

  // Otherwise if there aren't enough upgraders
  else if (upgraders.length < 2) {
    // Spawn a new one

    var newName = "Upgrader" + Game.time;
    Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, CARRY, MOVE], newName, {
      memory: { role: "upgrader", upgrading: false },
    });
  }

  // Otherwise if there aren't enough builders
  else if (builders.length < 4) {
    // Spawn a new one

    var newName = "Builder" + Game.time;
    Game.spawns["Spawn1"].spawnCreep([WORK, MOVE, CARRY, MOVE], newName, {
      memory: { role: "builder", building: false },
    });
  }

  // If the spawn is spawning a creep

  if (Game.spawns["Spawn1"].spawning) {
    // Get the creep being spawned

    var spawningCreep = Game.creeps[Game.spawns["Spawn1"].spawning.name];

    // Visualize the role of the spawning creep above the spawn

    Game.spawns["Spawn1"].room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      Game.spawns["Spawn1"].pos.x + 1,
      Game.spawns["Spawn1"].pos.y,
      { align: "left", opacity: 0.8 }
    );
  }

  // Loop through creep's names in Game.creeps
  for (let creepName in Game.creeps) {
    let creep = Game.creeps[creepName];

    if (creep.memory.role == "harvester") {
      new RoleHarvester().run(creep);
      continue;
    }

    if (creep.memory.role == "upgrader") {
      new RoleUpgrader().run(creep);
      continue;
    }

    if (creep.memory.role == "hauler") {
      new RoleHauler().run(creep);
      continue;
    }

    if (creep.memory.role == "builder") {
      new RoleBuilder().run(creep);
      continue;
    }
  }
};

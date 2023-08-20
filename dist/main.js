const Harvester = require("./roles/Harvester");
const Upgrader = require("./roles/Upgrader");
const Builder = require("./roles/Builder");
const {
  handleStuckCreeps,
  getDesiredCounts,
} = require("./utilities/helperFunctions");

const roles = {
  harvester: Harvester,
  upgrader: Upgrader,
  builder: Builder,
};

module.exports.loop = function () {
  handleStuckCreeps();

  const desiredCounts = getDesiredCounts();

  const getCurrentCounts = (role) =>
    _.sum(Game.creeps, (c) => c.memory.role === role);

  for (let role in desiredCounts) {
    if (getCurrentCounts(role) < desiredCounts[role]) {
      const newName = `${_.capitalize(role)}${Game.time}`;
      Game.spawns["Spawn1"].spawnCreep([WORK, CARRY, MOVE], newName, {
        memory: { role: role },
      });
      break;
    }
  }

  // Memory cleanup
  for (const name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
    }
  }

  // Unified creep role handling
  for (let name in Game.creeps) {
    const creep = Game.creeps[name];
    const RoleClass = roles[creep.memory.role];
    if (RoleClass) {
      const roleInstance = new RoleClass(creep);
      roleInstance.work();
    }
  }
};

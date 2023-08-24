# Screeps Code

## Getting Started

You'll need to create a `Gruntfile.js` file in the root of the project. It should look something like this:

```javascript
module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-screeps");

  grunt.initConfig({
    screeps: {
      options: {
        email: "YOUR-EMAIL-HERE",
        token: "YOUR-SCREEPS-API-TOKEN-HERE",
        branch: "default",
        server: "shard3",
      },
      dist: {
        src: ["dist/*.js"],
      },
    },
  });
};
```

Next, open a terminal at the root of this project and run `npm install` to install the dependencies.

Your code goes in the `dist` folder. To upload it to the Screeps server, run `npm run push` in the terminal.

## How it works

Screeps uses NodeJS as its runtime, but it has a few limitations if you're using the IDE in the game. Mainly, it doesn't support `import` or `export` statements, and doesn't support nested directories. Here, we're using Grunt to push code from the `dist` folder to the server, but we can expand it to overcome these limitations in the future by having it compile all of our code into a single `main.js` file. For now, I'm putting all of my code in the `dist` folder and using `npm run push` to push it to the server.

This is because, for now, I wanted to make sure I could get the code to run, and see all of the files in the game.

### Class-based Approach (OOP)

When brainstorming and looking through existing code-bases for Screeps, I saw how most people were creating enormous chains of logic through several nested functions. It was difficult for me to keep track of what was going on, and I wanted to a way to make it easier to understand and maintain. Using contextually named classes, I've been able to break down the logic into smaller, more manageable chunks, and build on seperate logic paths without "getting lost in the sauce".

While functional programming can be more efficient with CPU usage, an object oriented programming approach is a worthwhile trade-off for the readability and maintainability of the code.

### The Main Loop

The main loop is the core of the game. It's where all of the logic is executed, and where the game state is updated. Each "game tick", the game calls the `loop` function in `main.js`, which is where we'll be putting all of our code. I try to keep the `loop` function as clean as possible, and instantiate classes to handle the logic for each part of the game.

### Spawn Controller

The spawn controller is a class that represents a single spawn point. It's responsibility is to monitor and evaluate different aspects of the room it's in, handle the logic for spawning new creeps, and includes logic for each new creep's loadout based on the room's energy capacity.

### Creep Roles

Creeps are the units that you control in the game. They can be assigned different roles, and each role has a different set of responsibilities. For example, a harvester's job is to harvest energy from a source. A hauler's job is to move energy from sources to different assets that need it. A builder's job is to build structures in the room. An upgrader's job is to continuously provide energy to upgrade the room. Each role has a class that handles the logic for that role.

Additionally, all of these roles extend the `CreepBase` class, where I've put all of the logic that is common to all creeps. This includes things like moving to a target, gathering energy, etc. Any time I require repeating code between roles, I move it to the `CreepBase` class to make it more maintainable.

### Creeps Controller

As I've been building out the different roles and testing their efficiency, I saw a need for a controller that would help manage them more collectively. The `CreepsController` class is used for any logic that needs to be shared between all creeps, or between multiple creeps. For example, I use it to assign a designated source to each harvester, so that they don't all try to harvest from the same source. I also use it to assign a designated target to each hauler, so that they don't all try to move energy from the same target.

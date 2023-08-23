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

Next, run `npm install` to install the dependencies.

Your code goes in the `dist` folder. To upload it to the Screeps server, run `npm run push` in the terminal.

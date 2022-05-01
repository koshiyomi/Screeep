import { errorMapper } from './modules/errorMapper'


// var roleHarvester = require('role.harvester');
// var roleUpgrader = require('role.upgrader');
// var roleBuilder = require('role.builder');

import { harvester } from './modules/harvester'
import { Upgrader } from './modules/upgrader'


export const loop = errorMapper(() => {

    let name;
    for(name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // @ts-ignore

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        // @ts-ignore
        Game.spawns['Spawn1'].room.visual.text(
            // @ts-ignore
        '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(name in Game.creeps) {
        var creep = Game.creeps[name];
        // @ts-ignore
        if(creep.memory.role == 'harvester') {
            harvester.run(creep);
        }
        // @ts-ignore
        if(creep.memory.role == 'upgrader') {
            Upgrader.run(creep);
        }
    }
})

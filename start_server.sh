#!/bin/bash

pm2 start server.js --max-memory-restart $1 -i max
cd SupermanSLCM/

pm2 start update.js --max-memory-restart $2 -i max
cd ~/ThePostBackend/ 

echo 'Successfully started server.js in $1 and update.js $2 daemon in cluster mode'
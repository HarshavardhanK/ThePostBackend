#!/bin/bash

pm2 start server.js --max-memory-restart 500M -i max
cd SupermanSLCM/

pm2 start update.js --max-memory-restart 150M -i max
cd ~/ThePostBackend/ 

echo 'Successfully started server.js in $1 and update.js $2 daemon in cluster mode'
#!/bin/bash

pm2 start server.js --max-memory-restart 350M -i max
cd SupermanSLCM/

pm2 start update.js --max-memory-restart 450M -i max
cd ~/ThePostBackend/ 

echo 'Successfully started server.js and update.js daemon in cluster mode'
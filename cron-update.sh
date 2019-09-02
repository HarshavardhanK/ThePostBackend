#!/bin/bash

echo 'This script runs update.js on 2am - 6pm UTC every day of every week'
pm2 stop all

cd SupermanSLCM/
pm2 start update.js --max-memory-restart 200M -i max

cd ..

pm2 start server.js --max-memory-restart 200M -i max

echo 'Scripts running succesfully'

# 34 2-18 * * * /root/ThePostBackend/cron-update
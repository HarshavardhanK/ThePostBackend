#!/bin/bash

/bin/echo 'This script runs update.js on 2am - 6pm UTC every day of every week'
/bin/pm2 stop all

/bin/pm2 start /root/ThePostBackend/SupermanSLCM/update.js --max-memory-restart 200M -i max

/bin/cd ..

/bin/pm2 start server.js --max-memory-restart 200M -i max

/bin/echo 'Scripts running succesfully'

# 34 2-18 * * * /root/ThePostBackend/cron-update
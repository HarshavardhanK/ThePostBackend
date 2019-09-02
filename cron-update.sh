#!/bin/bash

echo 'This script runs update.js on 8am, 9am, 10am, 11am, 12am, 1pm, 2pm, 3pm, 4pm, 5pm, 6pm, 7pm, 8pm, 9pm, 10pm, 11pm every day of every week'
pm2 stop all

cd SupermanSLCM/
pm2 start update.js --max-memory-restart 200M -i max

cd ..

pm2 start server.js --max-memory-restart 200M -i max

echo 'Scripts running succesfully'
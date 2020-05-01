#!/bin/bash

pm2 start server.js --max-memory-restart 900M -i max
pm2 start ./SupermanSLCM/update.js --max-memory-restart 1200M -i max

echo 'Successfully started server.js and update.js daemon in cluster mode'
#!/bin/bash

pm2 start server.js --max-memory-restart 750M -i max

echo 'Successfully started server.js daemon in cluster mode'
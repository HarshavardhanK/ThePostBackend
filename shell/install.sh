#!/bin/bash

cd ~/ThePostBackend
npm install

cd SupermanSLCM
npm install

cd ..

cd Articles
cd ArticleWebView
npm install 

cd ~/ThePostBackend

chmod +x start_server.sh
chmod +x cron-update.sh
#!/usr/bin/env bash

#FIREWALL
sudo ufw app list
sudo ufw allow OpenSSH
sudo ufw allow ssh
sudo ufw enable

#INSTALL NODEJS

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
sudo npm install -g pm2

#INSTALL ALL NECESSARY MODULES BY NPM INSTALL.
#Here I am assuming you are in the directory cloned from GitHub for this project. PLEASE BE IN THAT DIRECTORY FOR THE NEXT COMMAND TO WORK
npm install

#INSTALL MONGODB
sudo apt update
sudo apt install -y mongodb

#check the service and database
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
#if not working ABORT

sudo systemctl enable mongodb
sudo systemctl start mongodb



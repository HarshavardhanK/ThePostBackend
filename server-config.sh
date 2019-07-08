#!/usr/bin/env bash

#INSTALL NODEJS

sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm

#INSTALL MONGODB
sudo apt update
sudo apt install -y mongodb

#check the service and database
mongo --eval 'db.runCommand({ connectionStatus: 1 })'
#if not working ABORT

sudo systemctl enable mongodb
sudo systemctl start mongodb

#FIREWALL
ufw app list
ufw allow OpenSSH

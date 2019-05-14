
//Uses Puppeteer module to extract HTML from SLCM Academics Detail loaded by using reg no. and password submitted by the user.

//Variables to be sent: reg and pass
//reg: User Registration Number
//pass: User Password

const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const database = require('./database.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let scrape = async (reg,pass) => {
  const browser = await puppeteer.launch({args: [
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--no-first-run',
    '--no-sandbox',
    '--no-zygote'
  ], headless:true});
  const page = await browser.newPage();
  try{
    await page.goto('http://slcm.manipal.edu/loginform.aspx',{timeout:25000});
  }
  catch(error){
    throw new Error("Website timed out.");
  }
  try{
    await page.waitForSelector('#btnLogin',{timeout:5000});
  }
  catch(error){
    throw new Error("Weak internet connection.");
  }
  await page.type('#txtUserid',reg);
  await page.type('#txtpassword',pass);
  await page.click('#btnLogin')
  await page.waitFor(500);

  try{
    const err = await page.$eval('span#labelerror', e => e.innerText);

    if(err != ''){
      var date = new Date();
      console.log("Login failed at " + date);
      throw new Error("Invalid Credentials.");
    }
  }
  catch(error){
    if(error.message == "Invalid Credentials."){
      throw new Error("Invalid Credentials.");
    }
    var date = new Date();
    console.log("Logged in at " + date);
  }

  await page.goto('http://slcm.manipal.edu/Academics.aspx');
  try{
    await page.waitForSelector('table#tblAttendancePercentage',{timeout:2000});
  }
  catch(error){
    throw new Error("Server error.");
  }

  const semester = await page.$$eval('span#ContentPlaceHolder1_lblAttenSem', bs => bs.map((b) => {
    return b.innerText;
  }));

  const attendance = await page.$$eval('table#tblAttendancePercentage tbody', bs => bs.map((b) => {

    var everythingString = b.innerHTML;
    everythingString = everythingString.replace(/<(?:.|\n)*?>/gm, '');
    everythingString = everythingString.replace(/\s\s+/g, ' ');
    everythingString = everythingString.replace('&amp;','AND');
    return everythingString;

  }));

  const marks = await page.$$eval('div.panel.panel-default' , bs => bs.map((b) => {
    var everythingString = b.innerHTML;
    everythingString = everythingString.replace(/<(?:.|\n)*?>/gm, '');
    everythingString = everythingString.replace(/\s\s+/g, ' ');
    return everythingString;
  }));

  browser.close();
  return {
    marks,
    attendance,
    semester
  };
};


const scrape_data = (reg, pass, callback) => {

  try{

    scrape(reg,pass).then((value) => {

        valueReq = {

          'status' : true,
          'message' : 'Successfully logged in.',
          'marks' : [],
          'attendance' : []

        }

        for(i=0;i<value.marks.length;i++){

          var subjectType = "Theory";

          var string = value.marks[i];
          var indexMoving = string.indexOf('Internal Maximum Marks');

          var subjectCode = string.slice(15,23);
          var subjectName = "";
          var totalInternalMarks = "";
          var sessionalMarks = {
            'sessional1':"",
            'sessional2':""
          };

          var sessStatus = true;

          var assignmentMarks = {
            'assignment1':'',
            'assignment2':'',
            'assignment3':'',
            'assignment4':''
          };

          var assignmentStatus = true;
          var totalMarks = 0;
          var outOfMarks = 0;
          var totalSessionalMarks = 0;
          var totalAssignmentMarks = 0;
          var outOfSessional = 0;


          if(indexMoving == -1){
            indexMoving = string.indexOf('Lab Maximum Marks');

            if(indexMoving == -1){
              subjectName = string.slice(24,-1);
              totalInternalMarks = 'null';
            }
            else{
              subjectType = "Lab";
              subjectName = string.slice(24,indexMoving-1);
            }
          }
          else{
            subjectName = string.slice(24,indexMoving-1);
          }

          subjectName = subjectName.replace('&amp;','AND');

          indexMoving = string.indexOf('Total Marks',indexMoving);

          if(totalInternalMarks == 'null' || indexMoving == -1){
            totalInternalMarks = 'null';
            sessionalMarks.sessional1 = 'null';
            sessionalMarks.sessional2 = 'null';
            sessStatus = false;
          }
          else{
            totalInternalMarks = string.slice(indexMoving + 18,indexMoving + 23);
            totalMarks += parseFloat(totalInternalMarks);
            totalSessionalMarks = parseFloat(totalInternalMarks);
            outOfMarks += parseFloat(string.slice(indexMoving + 12,indexMoving + 17));
            outOfSessional = parseFloat(string.slice(indexMoving + 12,indexMoving + 17));
          }

          if(sessStatus){

            indexMoving = string.indexOf('Internal Sessional 1');
            if(indexMoving == -1){
              sessionalMarks.sessional1 = 'null';
            }
            else{
              sessionalMarks.sessional1 = string.slice(indexMoving + 27,indexMoving + 32);
            }

            indexMoving = string.indexOf('Internal Sessional 2',indexMoving);
            if(indexMoving == -1){
              sessionalMarks.sessional2 = 'null';
            }
            else{
              sessionalMarks.sessional2 = string.slice(indexMoving + 27,indexMoving + 32);
            }
          }

          indexMoving = string.indexOf('Assignment Maximum Marks',indexMoving);
          if(indexMoving == -1){
            assignmentMarks.assignment1 = 'null';
            assignmentMarks.assignment2 = 'null';
            assignmentMarks.assignment3 = 'null';
            assignmentMarks.assignment4 = 'null';
            assignmentStatus = false;
          }
          if(assignmentStatus){

            indexMoving = string.indexOf('Assignment 1',indexMoving);
            if(indexMoving == -1){
              assignmentMarks.assignment1 = 'null';
            }
            else{
              assignmentMarks.assignment1 = string.slice(indexMoving + 18,indexMoving + 22);
            }

            indexMoving = string.indexOf('Assignment 2',indexMoving);
            if(indexMoving == -1){
              assignmentMarks.assignment2 = 'null';
            }
            else{
              assignmentMarks.assignment2 = string.slice(indexMoving + 18,indexMoving + 22);
            }

            indexMoving = string.indexOf('Assignment 3',indexMoving);
            if(indexMoving == -1){
              assignmentMarks.assignment3 = 'null';
            }
            else{
              assignmentMarks.assignment3 = string.slice(indexMoving + 18,indexMoving + 22);
            }

            indexMoving = string.indexOf('Assignment 4',indexMoving);
            if(indexMoving == -1){
              assignmentMarks.assignment4 = 'null';
            }
            else{
              assignmentMarks.assignment4 = string.slice(indexMoving + 18,indexMoving + 22);
            }
            totalMarks += parseFloat(string.slice(-6,-2));
            totalAssignmentMarks = parseFloat(string.slice(-6,-2));
            var val = parseFloat(string.slice(-12,-8));
            if(isNaN(val)){
              val = parseFloat(string.slice(-11,-7))
            }
            outOfMarks += val;
            outOfAssignment = val;
          }

          var dataReq = {
            'subjectCode':subjectCode,
            'subjectName':subjectName,
            'sessStatus':sessStatus,
            'totalSessionalMarks':totalSessionalMarks,
            'outOfSessional':outOfSessional,
            'sessionalMarks':sessionalMarks,
            'assignmentStatus':assignmentStatus,
            'totalAssignmentMarks':totalAssignmentMarks,
            'outOfAssignment':outOfAssignment,
            'assignmentMarks':assignmentMarks,
            'totalMarks':totalMarks,
            'outOfMarks':outOfMarks
          }

          valueReq.marks.push(dataReq);

        } //End of For
        var indexMoving = 0;
        var indexEnding = 0;
        var stringAtt = value.attendance[0];

        for(i=0;i<valueReq.marks.length;i++){

          var subjectName = valueReq.marks[i].subjectName;
          var subjectCode = valueReq.marks[i].subjectCode;
          var totalClass;
          var totalPresent;
          var absent;
          var attendancePercent;

          var semLength = value.semester[0].length;
          var subjectLength = subjectName.length;

          indexMoving = stringAtt.indexOf(subjectName,indexMoving);
          if(i < valueReq.marks.length - 1)
            indexEnding = stringAtt.indexOf(' 2018-2019 '+ valueReq.marks[i+1].subjectCode,indexEnding);
          else
            indexEnding = 0;

          if(indexMoving != -1){
            var allNums = stringAtt.slice(indexMoving + subjectLength + semLength + 2, indexEnding - 1);
            var numsArray = allNums.split(" ");
            totalClass = parseInt(numsArray[0]);
            totalPresent = parseInt(numsArray[1]);
            absent = parseInt(numsArray[2]);
            attendancePercent = parseFloat(numsArray[3]);
          }
          else{
            totalClass = 0;
            totalPresent = 0;
            attendancePercent = 0;
            absent = 0;
          }

          var attendanceEle = {
            'subjectCode' : subjectCode,
            'subjectName' : subjectName,
            'totalClass' : totalClass,
            'totalPresent' : totalPresent,
            'absent' : absent,
            'attendancePercent' : attendancePercent
          }

          valueReq.attendance.push(attendanceEle);

        }//End of For

        callback(null, valueReq);

    }).catch((error) => {
      console.log("#########################");
      console.log(error);
      console.log("#########################");
      valueReq = {
        'status':false,
        'message':error.message,
        'attendance':[],
        'marks':[]
      }
      callback(valueReq);

      var endD = new Date();
      var end = endD.getTime();
      console.log("TIME TAKEN");
      console.log((end-start)/1000);
    }); // End of Scrape
  }
  catch(error){
    console.log("#########################");
    console.log(error);
    console.log("#########################");
    if(error.name == "ReferenceError"){
      error.name = "Invalid Post Request.";
    }
    valueReq = {
      'status':false,
      'message':error.message,
      'attendance':[],
      'marks':[]
    }
    console.log(valueReq);
    callback(valueReq);

    var endD = new Date();
    var end = endD.getTime();
    console.log("TIME TAKEN");
    console.log((end-start)/1000);
  }

};



module.exports.scrape_data = scrape_data;

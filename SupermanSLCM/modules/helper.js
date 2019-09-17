const utilities = require('./utils/utilities');

const express = require('express');
const app = express();

class Helper{

  constructor(browser, SHOULD_GET_MARKS, res, GET_GRADES, SHOULD_GET_ATT, semToFetch){

    this.browser = browser;
    Helper.done = false;
    Helper.finalDet = {};
    Helper.canHost = false;
    this.response = res;
    this.startTime = new Date().getTime();

    this.SHOULD_GET_MARKS = SHOULD_GET_MARKS;
    this.SHOULD_GET_ATT = SHOULD_GET_ATT;
    this.GET_GRADES = GET_GRADES;

    this.semToFetch = semToFetch;
  }

  async executeLogin(reg, pass){

    const page = await this.browser.newPage();
    await page.setCacheEnabled(false);
    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    try{
      await page.goto('http://slcm.manipal.edu/loginform.aspx',{timeout:25000});
    }
    catch(error){
      utilities.displayError("Website Timed Out",this.response);
      return;
    }
    try{
      await page.waitForSelector('#btnLogin',{timeout:5000});
    }
    catch(error){
      utilities.displayError("Weak Internet Connection",this.response);
      return;
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
      if(error.message === "Invalid Credentials."){

          utilities.displayError("Invalid Credentials",this.response);
          return 'invalid credentials';
      }
      var date = new Date();
      console.log("Logged in at " + date);

      try{
        await page.goto('http://slcm.manipal.edu/gradesheet.aspx',{timeout:25000});
      }
      catch(error){
        utilities.displayError("Website Timed Out",this.response);
        return;
      }

      try{
        await page.waitForSelector('#ContentPlaceHolder1_lblCGPA',{timeout:25000});
      }
      catch(error){
        utilities.displayError("Website Timed Out",this.response);
        return;
      }

      Helper.done = true;

      while(!Helper.done) {deasync.sleep(100);}

      await page.goto('http://slcm.manipal.edu/Academics.aspx');

      var finalDet = [];

      var prevSem = -1;
      var loopContinues = false;

      Helper.finalDet.semester = await page.$eval('#ContentPlaceHolder1_lblSemester', e => e.innerText);

      Helper.finalDet.section = await page.$eval('#ContentPlaceHolder1_lblSection', e => e.innerText);

      Helper.finalDet.rollNo = await page.$eval('#ContentPlaceHolder1_lblRollNo', e => e.innerText);

      var teacherGuardianName = await page.$eval('#ContentPlaceHolder1_lblGuardian', e => e.innerText);

      var teacherGuardianPhone = await page.$eval('#ContentPlaceHolder1_lblGuardianTeacherMobile', e => e.innerText);

      var teacherGuardianEmail = await page.$eval('#ContentPlaceHolder1_lblGuardianTeacherEmail', e => e.innerText);

      var teacherGuardianStatus;

      if(teacherGuardianName == ""){
        teacherGuardianStatus = "Not Assigned";
      }
      else{
        teacherGuardianStatus = "Assigned";
      }

      Helper.finalDet.teacherGuardianStatus = teacherGuardianStatus;

      var teacherGuardianJson = {
        'name' : teacherGuardianName,
        'phone' : teacherGuardianPhone,
        'email' : teacherGuardianEmail
      }

      Helper.finalDet.teacherGuardianDetails = teacherGuardianJson;

      Helper.finalDet.admittedYear = await page.$eval('#ContentPlaceHolder1_lblAdmittedYear', e => e.innerText);

      try{
        await page.waitForSelector('table#tblAttendancePercentage',{timeout:2000});
      }
      catch(error){
        utilities.displayError("Server Error",this.response);
        return;
      }

      const semester = await page.$eval('#ContentPlaceHolder1_ddlInternalSemester option[selected="selected"]', bs => bs.innerText);

      var subjects = await page.$$eval('h4.panel-text.panel-title', bs => bs.map((b) => {
        return b.innerText.trim().replace(/\s\s+/g, ' ');
      }));

      subjects = utilities.trimFromStart(subjects, 14);

      var internalMarks = [];

      subjects = utilities.trimFromEndForSubjects(subjects);

      var attendanceStatus = true;

      var attendanceHeaders = await page.$$eval('#tblAttendancePercentage thead tr th', bs => bs.map((b) => {
        return b.innerText.trim();
      }));

      var attendanceData = await page.$$eval('#tblAttendancePercentage tbody tr td', bs => bs.map((b) => {
        return b.innerText.trim();
      }));

      var marksHeaders = await page.$$eval('div.panel-body.mit-bg table tbody', bs => bs.map((b) => {
        return b.innerText.trim();
      }));

      var everything = await page.$$eval('div.panel-group.internalMarks', bs => bs.map((b) => {
        return b.innerText.trim();
      }));
      everything = utilities.getEverythingSplit_marks(everything);

      marksHeaders = utilities.getMarksSplit(marksHeaders);

      attendanceData = utilities.modifyAttendance(attendanceHeaders, attendanceData);
      internalMarks = utilities.modifyMarks(marksHeaders, subjects, everything);

      const marksStatus = internalMarks.length != 0;
      var reqJson = utilities.stylify(semester, subjects, marksStatus,attendanceStatus , attendanceData, internalMarks);
      finalDet.push(reqJson);

      Helper.semester = semester;

      //this.browserClose();
      console.log("TIME TAKEN: " + (new Date().getTime() - this.startTime)/1000);
      var finallyDet = {
        'message':'OK',
        'status' : true,
        'updatedAt': this.startTime,
        'cgpa': Helper.cgpa,
        'semester': Helper.finalDet.semester,
        'section': Helper.finalDet.section,
        'rollno': Helper.finalDet.rollNo,
        'admittedYear': Helper.finalDet.admittedYear,
        'teacherGuardianStatus': Helper.finalDet.teacherGuardianStatus,
        'teacherGuardianDetails': Helper.finalDet.teacherGuardianDetails,
        'academicDetails': finalDet
      }
      //this.response.send(finallyDet);

      await page.close();
      await this.browserClose();
      await this.hostFinalJson();
      return finallyDet;
    }
  }

  browserClose(){
    this.browser.close();
  }

  hostFinalJson(){

    Helper.canHost = true;

  }
}

module.exports = Helper;

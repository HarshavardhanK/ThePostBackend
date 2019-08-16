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
      if(error.message == "Invalid Credentials."){

          utilities.displayError("Invalid Credentials",this.response);
          return;
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
      Helper.cgpa = await page.$eval('#ContentPlaceHolder1_lblCGPA', bs => bs.innerText);

      page.close();

      Helper.done = true;

      if(this.SHOULD_GET_MARKS){
        this.getDataMarks(this.semToFetch);
      }
      else if(this.SHOULD_GET_ATT){
        this.getDataAttendance(this.semToFetch);
      }
      else if(this.GET_GRADES){
        this.getGradeSheet(this.semToFetch);
      }
      else { 
        return this.getData();
      }
    }
  }

  async getDataMarks(semToFetch){

    const page = await this.browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto('http://slcm.manipal.edu/Academics.aspx');
    var finalDet = [];

    var prevSem = -1;
    var loopContinues = true;

      try{
        await page.waitForSelector('#ContentPlaceHolder1_ddlInternalSemester',{timeout:5000});
      }
      catch(error){
        utilities.displayError("Server Error",this.response);
        return;
      }

      const semester = semToFetch

          page.select('#ContentPlaceHolder1_ddlInternalSemester', semToFetch);
          await page.waitFor(10);
          await page.evaluate(()=>document.querySelector('#ContentPlaceHolder1_lnkBtnInternalMark').click());

          var innerDone = true;

          while(innerDone){
            if(await page.$eval('#ContentPlaceHolder1_ddlInternalSemester option[selected="selected"]', bs => bs.innerText) == semToFetch)
              innerDone = false;
            else {
              await page.waitFor(1);
            }
          }


      var subjects = await page.$$eval('h4.panel-text.panel-title', bs => bs.map((b) => {
        return b.innerText.trim().replace(/\s\s+/g, ' ');
      }));

      subjects = utilities.trimFromStart(subjects, 14);

      var internalMarks = utilities.getTotalMarks(subjects);

      subjects = utilities.trimFromEndForSubjects(subjects);

      const marksStatus = internalMarks.length != 0;

      Helper.semester = semester;
      var attendanceStatus = false;
      var attendanceData = [ ];

        var reqJson = utilities.stylify(semester,subjects, marksStatus,attendanceStatus , attendanceData, internalMarks);

    this.browserClose();

    console.log("TIME TAKEN: " + (new Date().getTime() - this.startTime)/1000);

    this.response.send(reqJson);
  }

  async getDataAttendance(semToFetch){

    const page = await this.browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto('http://slcm.manipal.edu/Academics.aspx');
    var finalDet = [];

    var prevSem = -1;
    var loopContinues = true;

    var teacherGuardianJson = {
      'name' : '',
      'phone' : '',
      'email' : ''
    }

    try{
        await page.waitForSelector('#ContentPlaceHolder1_ddlSemester',{timeout:2000});
      }
      catch(error){
        utilities.displayError("Server Error",this.response);
        return;
      }

      const semester = semToFetch;

          page.select('#ContentPlaceHolder1_ddlSemester',semToFetch);
          await page.waitFor(10);

          var innerDone = true;

          while(innerDone){
            console.log(await page.$eval('#ContentPlaceHolder1_ddlSemester option[selected="selected"]', bs => bs.innerText));
            if(await page.$eval('#ContentPlaceHolder1_ddlSemester option[selected="selected"]', bs => bs.innerText) == semToFetch)
              innerDone = false;
            else {
              await page.waitFor(1);
            }
          }


      const marksStatus = false;

      var attendanceStatus = true;
      var attendanceData = await page.$$eval('#tblAttendancePercentage tbody tr td', bs => bs.map((b) => {
        return b.innerText.trim();
      }));

      Helper.semester = semester;


        attendanceData = utilities.modifyAttendance(attendanceData);

        var reqJson = utilities.stylify(semester,[ ], marksStatus,attendanceStatus , attendanceData, [ ]);

    this.browserClose();
    console.log("TIME TAKEN: " + (new Date().getTime() - this.startTime)/1000);

    this.response.send(reqJson);
  }

  async getGradeSheet(semToFetch){

    const page = await this.browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

    await page.goto('http://slcm.manipal.edu/GradeSheet.aspx');

    var gradeStatus = false;
    var done = false;
    var prevSem = -1;
    var grades = [];

    var finalGradeJson = {
      'message':'',
      'status':false,
      'cgpa': '',
      'semesterGrades': []
    }

    try{
      await page.waitForSelector('#ContentPlaceHolder1_ddlSemester',{timeout:25000});
    }
    catch(error){
      utilities.displayError("Website Timed Out",this.response);
      return;
    }

    const cgpa = await page.$eval('#ContentPlaceHolder1_lblCGPA', bs => bs.innerText);

    page.select('#ContentPlaceHolder1_ddlSemester', semToFetch);

    try{
      await page.waitForSelector('#ContentPlaceHolder1_ddlSemester',{timeout:5000});
    }
    catch(error){
      utilities.displayError("Website Timed Out",this.response);
    }

    var innerDone = true;

    while(innerDone){
      if(await page.$eval('#ContentPlaceHolder1_ddlSemester option[selected="selected"]', bs => bs.innerText) == semToFetch)
        innerDone = false;
      else {
        await page.waitFor(1);
      }
    }

    const semester = semToFetch;

    var gradeSheetHeaders = await page.$$eval('#ContentPlaceHolder1_grvGradeSheet tbody tr th', bs => bs.map((b) => {
      return b.innerText.trim();
    }));

    var gradeSheet = await page.$$eval('#ContentPlaceHolder1_grvGradeSheet tbody tr td', bs => bs.map((b) => {
      return b.innerText.trim();
    }));

    const gpa = await page.$eval('#ContentPlaceHolder1_lblGPA', bs => bs.innerText);
    const credits = await page.$eval('#ContentPlaceHolder1_LabelTotalcredit', bs => bs.innerText);

    gradeSheet = utilities.modifyGradeSheet(gradeSheetHeaders, gradeSheet, semester, gpa, credits);
    grades.push(gradeSheet);


    finalGradeJson.semesterGrades = grades;
    finalGradeJson.cgpa = cgpa;
    finalGradeJson.status = true;
    finalGradeJson.message = 'OK';

    this.hostFinalJson();
    this.browserClose();

    console.log("TIME TAKEN: " + (new Date().getTime() - this.startTime)/1000)

    this.response.send(finalGradeJson);
  }

  async getData() {

    while(!Helper.done) {deasync.sleep(1000);}

    const page = await this.browser.newPage();

    await page.setRequestInterception(true);

    page.on('request', (req) => {
        if(req.resourceType() == 'stylesheet' || req.resourceType() == 'font' || req.resourceType() == 'image'){
            req.abort();
        }
        else {
            req.continue();
        }
    });

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

    var internalMarks = utilities.getTotalMarks(subjects);

    subjects = utilities.trimFromEndForSubjects(subjects);

    const marksStatus = internalMarks.length != 0;

    var attendanceStatus = true;
    var attendanceData = await page.$$eval('#tblAttendancePercentage tbody tr td', bs => bs.map((b) => {
      return b.innerText.trim();
    }));


    attendanceData = utilities.modifyAttendance(attendanceData);
    var reqJson = utilities.stylify(semester, subjects, marksStatus,attendanceStatus , attendanceData, internalMarks);
    finalDet.push(reqJson);

    Helper.semester = semester;

    this.browserClose();
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

    return finallyDet;
  }

  browserClose(){
    this.browser.close();
  }

  hostFinalJson(){

    Helper.canHost = true;

  }

}

module.exports = Helper;

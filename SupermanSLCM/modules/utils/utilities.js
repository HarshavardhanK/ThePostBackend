module.exports.trimFromStart = function(rawArray, startIndice){

  compiledArray  = [];
  rawArray.forEach(function(item) {

    compiledArray.push(item.slice(startIndice));
  })

  return compiledArray;
}

module.exports.getTotalMarks = function(rawArray){
  marksArray = [];
  rawArray.forEach(function(item) {

    var index = item.lastIndexOf('Marks Obtained: ')
    var secondIndex = item.lastIndexOf('Max Marks: ')
    if(index!=-1){

      var marksObtained = item.slice(index + 16, secondIndex -1);
      var maxMarks = item.slice(secondIndex + 11);
      var subjectName = item.slice(0, index - 1);

      subjectName = modifySubjectName(subjectName);

      var reqJson = {
        'subjectName' : subjectName,
        'marksObtained' : marksObtained,
        'maxMarks' : maxMarks
      }

      marksArray.push(reqJson);
    }
  })

  return marksArray;
}

function modifySubjectName(subjectName){
  var sub = subjectName.slice(0,2);
  if(sub == 'OE' || sub == 'PE'){
    return subjectName;
  }
  else
    return subjectName.slice(9);
}

module.exports.trimFromEnd = function(rawArray, startIndice){
  compiledArray  = [];
  rawArray.forEach(function(item) {

    compiledArray.push(item.slice(0, startIndice));
  })

  return compiledArray;
}

module.exports.trimFromEndForSubjects = function(rawArray){
  compiledArray  = [];
  rawArray.forEach(function(item) {

    var index = item.lastIndexOf('Marks Obtained: ');

    if(index!=-1)
      compiledArray.push(item.slice(0, index-1));
    else
      compiledArray.push(item);
  })

  return compiledArray;
}

module.exports.isArrayNull = function(rawArray) {

  return rawArray.every(element => element === null)
}

module.exports.modifyAttendance = function(rawAttendanceArray){

    compiledArray = [];
    var i =0;
    var subjectName,totalClass, present, absent;
    rawAttendanceArray.forEach(function(item) {
      if(i%8==2){
        subjectName = item;
        i++;
        return;
      }
      if(i%8==4){
        totalClass = item;
        i++;
        return;
      }
      if(i%8==5){
        present = item;
        i++;
        return;
      }
      if(i%8==6){
        absent = item;
        i++;

        var reqJson = {
          'subjectName' : subjectName,
          'totalClasses' : totalClass,
          'classesAttended' : present,
          'classesAbsent' : absent
        }

        compiledArray.push(reqJson);
        return;
      }

      i++;
    })

    return compiledArray;
}

module.exports.modifyGradeSheet = function(gradeHeaders, gradeArray, semester, gpa, credits){

  var compiledGrades = {
    'semester' : semester,
    'gpa' : gpa,
    'credits' : credits,
    'grades' : []
  }

  var i =0;
  var inner_i = 0;
  var subjectCode, subjectName, credits, grade;

  if(gradeArray.length < 8){
    compiledGrades.semester = semester;
    return compiledGrades;
  }

  var subjectCodeIndex = -1;
  var subjectNameIndex = -1;
  var creditsIndex = -1;
  var gradeIndex = -1;

  gradeHeaders.forEach(function(item) {
    if(item.toLowerCase() == "subject code"){
      subjectCodeIndex = inner_i;
      inner_i++;
      return;
    }
    else if(item.toLowerCase() == "subject name"){
      subjectNameIndex = inner_i;
      inner_i++;
      return;
    }
    else if(item.toLowerCase() == "grade"){
      gradeIndex = inner_i;
      inner_i++;
      return;
    }
    else if(item.toLowerCase() == "credit"){
      creditsIndex = inner_i;
      inner_i++;
      return;
    }
  })

  gradeArray.forEach(function(item) {
    if(i%8 == subjectCodeIndex){
      subjectCode = item;
      i++;
      return;
    }
    else if(i%8 == subjectNameIndex){
      subjectName = item;
      i++;
      return;
    }
    else if(i%8 == gradeIndex){
      grade = item;
      i++;
      return;
    }
    else if(i%8 == creditsIndex){
      credits = item;

      var gradeJson = {
        'subjectCode' : subjectCode,
        'subjectName' : subjectName,
        'credits' : credits,
        'grade' : grade
      }

      compiledGrades.grades.push(gradeJson);
      i++;
      return;
    }
    i++;
  })

  return compiledGrades;
}

module.exports.subtractRoman = function(romanNum){
  if(romanNum == 'I')
    return -1;
  else {
    switch(romanNum){
      case 'II':
        return 'I';
      case 'III':
        return 'II';
      case 'IV':
        return 'III';
      case 'V':
        return 'IV';
      case 'VI':
        return 'V';
      case 'VII':
        return 'VI';
      case 'VIII':
        return 'VII';
    }
  }
}

module.exports.displayError = function(message, res){
    var error =
    {
      'message' : message,
      'status' : false,
      "cgpa": "",
      'semester': "",
      'section': "",
      'rollno': "",
      'admittedYear': "",
      'teacherGuardianStatus': "",
      'teacherGuardianDetails': "",
      "academicDetails": [ ]
    }
    res.send(error);
}

module.exports.stylify = function(semester,subjects, marksStatus, attendanceStatus, attendanceData, internalMarks){

  var reqJson = {
    'semester' : semester,
    'subjects' : subjects,
    'marksStatus' : marksStatus,
    'internalMarks' : internalMarks,
    'attendanceStatus' : attendanceStatus,
    'attendance' : attendanceData
  }

  return reqJson;
}

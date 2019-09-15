var splitOrig = String.prototype.split;

function splitMulti(str, tokens){
    var tempChar = tokens[0];
    for(var i = 1; i < tokens.length; i++){
        str = str.split(tokens[i]).join(tempChar);
    }
    str = str.split(tempChar);
    return str;
}

String.prototype.split = function (){
    if(arguments[0].length > 0){
        if(Object.prototype.toString.call(arguments[0]) == "[object Array]" ) {
            return splitMulti(this, arguments[0]);
        }
    }
    return splitOrig.apply(this, arguments);
};

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

module.exports.modifyAttendance = function(headers, rawAttendanceArray){

    compiledArray = [];
    var i =0;
    var inner_i = 0;
    var subjectName,totalClass, present, absent;

    var subjectNameIndex = -1;
    var totalClassIndex = -1;
    var presentIndex = -1;
    var absentIndex = -1;

    headers.forEach(function(item) {

      if(item.toLowerCase() == "subject"){

        subjectNameIndex = inner_i;
        inner_i++;
        return;
      }

      else if(item.toLowerCase() == "total class"){

        totalClassIndex = inner_i;
        inner_i++;
        return;
      }

      else if(item.toLowerCase() == "days present"){

        presentIndex = inner_i;
        inner_i++;
        return;
      }

      else if(item.toLowerCase() == "days absent"){

        absentIndex = inner_i;
        inner_i++;
        return;
      }
      else{
        inner_i++;
      }
    })

    rawAttendanceArray.forEach(function(item) {
      if(i%8== subjectNameIndex){
        subjectName = item;
        i++;
        return;
      }
      if(i%8== totalClassIndex){
        totalClass = item;
        i++;
        return;
      }
      if(i%8== presentIndex){
        present = item;
        i++;
        return;
      }
      if(i%8== absentIndex){
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
  var length = gradeHeaders.length;

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
    else{
      inner_i++;
    }
  })

  gradeArray.forEach(function(item) {
    if(i%length == subjectCodeIndex){
      subjectCode = item;
      i++;
      return;
    }
    else if(i%length == subjectNameIndex){
      subjectName = item;
      i++;
      return;
    }
    else if(i%length == gradeIndex){
      grade = item;
      i++;
      return;
    }
    else if(i%length == creditsIndex){
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

module.exports.getMarksSplit = function(raw){

  var data = []

  for(var i=0;i<raw.length;i++)
    data.push(raw[i].split(['\n','\t']));

  return data;
}

module.exports.getEverythingSplit_marks = function(raw){

    var data = []

    for(var i=0;i<raw.length;i++)
      data = raw[i].split(['\n']);

    var data_new = [];

    for(var i=0;i<data.length;i++){
      if(!data[i].toLowerCase().startsWith('subject code')){
        if(data[i-1].toLowerCase().startsWith('subject code')){
          data_new.push(data[i-1]);
        }
      }
    }

    return data_new;
}

module.exports.modifyMarks = function(rawArray, subjects, non_empty){

  compiledArray = [];

  for(var i=0;i<subjects.length;i++){

    var core_json = {
      'subject_name' : subjects[i],
      'status' : false,
      'is_lab' : false,
      'sessional' : {
        '_one':-1,
        '_two':-1
      },
      'assignment' : {
        '_one':-1,
        '_two':-1,
        '_three':-1,
        '_four':-1
      },
      'lab' : {
        'assessments' : []
      }
    };

    compiledArray.push(core_json);
  }

  var non_empty_index = 0;

  for(var i=0;i<rawArray.length;i++){

    var subject_base = non_empty[i];
    var index = -1;

    if(i>=2){

      if((rawArray[i-1][0].toLowerCase().includes('assignment') || rawArray[i][0].toLowerCase().includes('assignment')) && (rawArray[i-1][0].toLowerCase().includes('internal') || rawArray[i][0].toLowerCase().includes('internal'))){}
      else{
        for(var x=0;x<compiledArray.length;x++){
          if(non_empty[non_empty_index].toLowerCase().includes(compiledArray[x].subject_name.toLowerCase())){
            index = x;
            non_empty_index++;
            break;
          }
        }
      }
    }
    else{
      for(var x=0;x<compiledArray.length;x++){
        if(non_empty[non_empty_index].toLowerCase().includes(compiledArray[x].subject_name.toLowerCase())){
          index = x;
          non_empty_index++;
          break;
        }
      }
    }

    if(!rawArray[i][0].toLowerCase().includes('lab')){

      compiledArray[index].is_lab = false;
      compiledArray[index].status = true;

      if(rawArray[i][0].toLowerCase().includes('assignment')){
        for(var j=3;j<rawArray[i].length;j=j+3){

          if(rawArray[i][j].includes('1'))
            compiledArray[index].assignment._one = rawArray[i][j+2];
          else if(rawArray[i][j].includes('2'))
            compiledArray[index].assignment._two = rawArray[i][j+2];
          else if(rawArray[i][j].includes('3'))
            compiledArray[index].assignment._three = rawArray[i][j+2];
          else if(rawArray[i][j].includes('4'))
            compiledArray[index].assignment._four = rawArray[i][j+2];
        }
      }
      else{
        for(var j=3;j<rawArray[i].length;j=j+3){

          if(rawArray[i][j].includes('1'))
            compiledArray[index].sessional._one = rawArray[i][j+2];
          else if(rawArray[i][j].includes('2'))
            compiledArray[index].sessional._two = rawArray[i][j+2];
        }
      }
    }
    else{

      compiledArray[index].is_lab = true;
      compiledArray[index].status = true;

      for(var j=3;j<rawArray[i].length;j=j+3){
        var r = {
          'assessment_desc' : rawArray[i][j],
          'marks' : rawArray[i][j+2]
        }

        compiledArray[index].lab.assessments.push(r);
      }
    }
  }

  return compiledArray;
}

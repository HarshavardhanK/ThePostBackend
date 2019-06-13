module.exports.generate_slcm_data = function() {

  const object_constant = {
    status: true,
    message: "Successfully logged in.",
    marks: [{
        subjectCode: "CSE 2201",
        subjectName: "FORMAL LANGUAGES AND AUTOMATA THEORY",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: true,
        totalAssignmentMarks: 17.5,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: "4.00",
          assignment2: "5.00",
          assignment3: "4.00",
          assignment4: "4.50"
        },
        totalMarks: 17.5,
        outOfMarks: 20
      },
      {
        subjectCode: "CSE 2202",
        subjectName: "DESIGN AND ANALYSIS OF ALGORITHMS",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: true,
        totalAssignmentMarks: 19,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: "5.00",
          assignment2: "5.00",
          assignment3: "4.00",
          assignment4: "5.00"
        },
        totalMarks: 19,
        outOfMarks: 20
      },
      {
        subjectCode: "CSE 2203",
        subjectName: "MICROPROCESSORS",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: true,
        totalAssignmentMarks: 13,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: "4.00",
          assignment2: 0,
          assignment3: "3.00",
          assignment4: "3.00"
        },
        totalMarks: 13,
        outOfMarks: 20
      },
      {
        subjectCode: "CSE 2204",
        subjectName: "DATABASE SYSTEMS",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: true,
        totalAssignmentMarks: 15,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: "3.00",
          assignment2: "4.00",
          assignment3: "5.00",
          assignment4: "3.00"
        },
        totalMarks: 15,
        outOfMarks: 20
      },
      {
        subjectCode: "CSE 2211",
        subjectName: "MICROPROCESSORS LAB",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: false,
        totalAssignmentMarks: 0,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: 0,
          assignment2: 0,
          assignment3: 0,
          assignment4: 0
        },
        totalMarks: 0,
        outOfMarks: 0
      },
      {
        subjectCode: "CSE 2212",
        subjectName: "DATABASE SYSTEMS LAB",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: false,
        totalAssignmentMarks: 0,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: 0,
          assignment2: 0,
          assignment3: 0,
          assignment4: 0
        },
        totalMarks: 0,
        outOfMarks: 0
      },
      {
        subjectCode: "MAT 2206",
        subjectName: "ENGINEERING MATHEMATICS - IV",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: true,
        totalAssignmentMarks: 19,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: "4.00",
          assignment2: 0,
          assignment3: "5.00",
          assignment4: "5.00"
        },
        totalMarks: 19,
        outOfMarks: 20
      },
      {
        subjectCode: "PHY 3281",
        subjectName: "OPEN ELECTIVE - FUNDAMENTALS OF ASTRONOMY AND ASTROPHYSICS",
        sessStatus: false,
        totalSessionalMarks: 0,
        outOfSessional: 0,
        sessionalMarks: {
          sessional1: 0,
          sessional2: 0
        },
        assignmentStatus: true,
        totalAssignmentMarks: 15,
        outOfAssignment: 20,
        assignmentMarks: {
          assignment1: "4.00",
          assignment2: 0,
          assignment3: "4.00",
          assignment4: "4.00"
        },
        totalMarks: 15,
        outOfMarks: 20
      }
    ],
    attendance: [{
        subjectCode: "CSE 2201",
        subjectName: "FORMAL LANGUAGES AND AUTOMATA THEORY",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "CSE 2202",
        subjectName: "DESIGN AND ANALYSIS OF ALGORITHMS",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "CSE 2203",
        subjectName: "MICROPROCESSORS",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "CSE 2204",
        subjectName: "DATABASE SYSTEMS",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "CSE 2211",
        subjectName: "MICROPROCESSORS LAB",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "CSE 2212",
        subjectName: "DATABASE SYSTEMS LAB",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "MAT 2206",
        subjectName: "ENGINEERING MATHEMATICS - IV",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      },
      {
        subjectCode: "PHY 3281",
        subjectName: "OPEN ELECTIVE - FUNDAMENTALS OF ASTRONOMY AND ASTROPHYSICS",
        totalClass: 0,
        totalPresent: 0,
        absent: 0,
        attendancePercent: 0
      }
    ]
  };

};

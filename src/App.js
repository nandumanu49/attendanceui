import React, { useState, useEffect } from 'react';
import './App.css';
import Axios from 'axios';
import StudentList from './StudentList';
import Login from './Login'; // Import the Login component

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [name, setName] = useState('');
  const [rollnumber, setRollnumber] = useState(0);
  const [studentList, setStudentList] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    if (authenticated) {
      Axios.get('https://nanduattendance.onrender.com/read') // Updated API URL
        .then((response) => {
          setStudentList(response.data);
        })
        .catch((error) => {
          console.error('Error fetching student list:', error);
        });
    }
  }, [authenticated]); // Fetch data only when authenticated state changes

  const addToList = () => {
    Axios.post('https://nanduattendance.onrender.com/insert', { name: name, rollnumber: rollnumber }) // Updated API URL
      .then((response) => {
        console.log('Student added successfully');
        setStudentList((prevList) => [...prevList, response.data]);
        setName('');
        setRollnumber(0);
      })
      .catch((error) => {
        console.error('Error adding student:', error);
      });
  };

  const handleAttendanceChange = (studentId, attendance) => {
    setAttendanceData((prevData) => ({
      ...prevData,
      [studentId]: attendance,
    }));
  };

  const handleUpdateAttendance = () => {
    const attendanceArray = Object.entries(attendanceData).map(([studentId, attendance]) => ({
      studentId,
      attendance,
    }));

    Axios.post('https://nanduattendance.onrender.com/attendance', { attendanceData: attendanceArray }) // Updated API URL
      .then(() => {
        console.log('Attendance recorded successfully');
      })
      .catch((error) => {
        console.error('Error recording attendance:', error);
      });
  };
  

  // const handleViewAttendance = () => {
  //   Axios.get('https://nanduattendance.onrender.com/attendance') // Updated API URL
  //     .then((response) => {
  //       setAttendanceData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching attendance data:', error);
  //     });
  // };

  const handleLogin = (displayName) => {
    setName(displayName); // Use display name as the username for simplicity
    setAuthenticated(true);
  };

  const handleLogout = () => {
    setAuthenticated(false);
    setName('');
  };

  const handleDownloadAttendance = () => {
    Axios({
      url: 'https://nanduattendance.onrender.com/download',
      method: 'GET',
      responseType: 'blob', // Important
    })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'attendance.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((error) => {
        console.error('Error downloading attendance data:', error);
      });
  };
  

  return (
    <div className="App">
      {authenticated ? (
        <>
          <h1> ATTENDANCE REPORT </h1>

          <div className="StudentForm">
            <label>Name:</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <label>Roll Number:</label>
            <input type="number" value={rollnumber} onChange={(e) => setRollnumber(e.target.value)} />
            <button onClick={addToList}>Add to List</button>
          </div>
          <StudentList
            studentList={studentList}
            attendanceData={attendanceData}
            handleAttendanceChange={handleAttendanceChange}
          />
          <div className="ButtonContainer">
            <button className="UpdateButton" onClick={handleUpdateAttendance}>
              Update
            </button>
            {/* <button className="ViewButton" onClick={handleViewAttendance}>
              View Attendance
            </button> */}
            <button className="DownloadButton" onClick={handleDownloadAttendance}>
          Download Attendance
        </button>

          </div>
          {Object.keys(attendanceData).length > 0 && (
            <div className="AttendanceTable">
              <h2>Attendance Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Roll Number</th>
                    <th>Attendance</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(attendanceData).map(([studentId, attendance]) => {
                    const student = studentList.find((student) => student._id === studentId);
                    return (
                      <tr key={studentId}>
                        <td>{student.name}</td>
                        <td>{student.rollNumber}</td>
                        <td>{attendance}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;

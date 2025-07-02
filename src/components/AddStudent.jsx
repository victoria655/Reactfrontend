import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const AddStudent = ({ addStudent, setSelectedStudent }) => {
  const [studentData, setStudentData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    admissionNumber: "",
    grade: "",
  });

  const handleChange = (field, value) => {
    setStudentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstName, middleName, lastName, admissionNumber, grade } =
      studentData;

    if (!firstName || !middleName || !lastName || !admissionNumber || !grade) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      firstname: firstName,
      middlename: middleName,
      lastname: lastName,
      admission_number: admissionNumber,
      grade,
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("https://backendd-8.onrender.com/students/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add student");
      }

      const data = await res.json();

      // Combine full name for local display
      const fullName = [firstName, middleName, lastName]
        .filter(Boolean)
        .join(" ");

      addStudent({ ...payload, name: fullName, id: data.student_id });
      toast.success("Student added successfully!");

      setStudentData({
        firstName: "",
        middleName: "",
        lastName: "",
        admissionNumber: "",
        grade: "",
      });

      setSelectedStudent(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="add-student">
      <h2>Add New Student</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            value={studentData.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Middle Name:</label>
          <input
            type="text"
            value={studentData.middleName}
            onChange={(e) => handleChange("middleName", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            value={studentData.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Admission Number:</label>
          <input
            type="text"
            value={studentData.admissionNumber}
            onChange={(e) => handleChange("admissionNumber", e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Grade:</label>
          <select
            value={studentData.grade}
            onChange={(e) => handleChange("grade", e.target.value)}
            required
          >
            <option value="">Select Grade</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((g) => (
              <option key={g} value={`Grade ${g}`}>{`Grade ${g}`}</option>
            ))}
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="add-button"
        >
          Add Student
        </motion.button>
      </form>
    </div>
  );
};

export default AddStudent;

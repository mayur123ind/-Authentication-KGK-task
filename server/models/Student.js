import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String
})
  
const StudentModel = mongoose.model("students", StudentSchema)
export default StudentModel
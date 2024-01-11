import mongoose from "mongoose";

const categoryBlueprint = {
  category: String,
  exercises: [String]
}

const exerciseSchema = new mongoose.Schema(categoryBlueprint)
const Exercise = mongoose.model('Exercise', exerciseSchema)

export { mongoose, Exercise }
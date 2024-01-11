import mongoose from "mongoose";

const categoryBlueprint = {
  category: String,
  exercises: [String]
}

const exerciseSchema = new mongoose.Schema(categoryBlueprint)
const Exercise = mongoose.model('Exercise', exerciseSchema)
//e.g {category: Chest, exercises: ['Bench Press', 'Push Up]}

const logBlueprint =
{
  date: String,
  data: [
    {
      category: String,
      exercises: [
        {
          name: String,
          weight: [Number],
          reps: [Number]
        }
      ]
    }
  ]
}

const logSchema = new mongoose.Schema(logBlueprint);
const Log = mongoose.model('Log', logSchema)

export { mongoose, Exercise, Log }
import mongoose from "mongoose";

const categoryBlueprint = {
  category: String,
  exercises: [String],
};

const exerciseSchema = new mongoose.Schema(categoryBlueprint);
const Exercise = mongoose.model("Exercise", exerciseSchema);
//e.g {category: Chest, exercises: ['Bench Press', 'Push Up]}

const logBlueprint = {
  date: { type: String, required: true },
  data: [
    {
      category: { type: String, required: true },
      exercises: [
        {
          name: { type: String, required: true },
          weight: { type: [Number], required: true },
          reps: { type: [Number], required: true },
        },
      ],
    },
  ],
};

const logSchema = new mongoose.Schema(logBlueprint);
const Log = mongoose.model("Log", logSchema);

export { mongoose, Exercise, Log };

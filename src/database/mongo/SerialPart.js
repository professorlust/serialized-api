// import {Schema} from "mongoose";
import mongoose, { Schema } from "mongoose";
// FIXME: Change serial_id to parentSerial

const SerialPartSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  creation_date: {
    type: Date,
    required: true
  },
  serial_id: {
    type: Schema.Types.ObjectId,
    ref: "Serial",
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  part_number: {
    type: Number,
    required: true
  }
});

export default mongoose.model("SerialPart", SerialPartSchema);

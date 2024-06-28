import mongoose, { Schema } from "mongoose";

export const UserWeaponsSchema = new Schema({
  name: {
    type: String,
    require: true,
  },
  attack: {
    type: Number,
    require: true,
  },
  defense: {
    type: Number,
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
});

const WeaponSchema = new Schema({
  id: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  attack: {
    type: Number,
    require: true,
  },
  defense: {
    type: Number,
    require: true,
  },
  copperPrice: {
    type: Number,
    require: true,
  },
  silverPrice: {
    type: Number,
    require: true,
  },
  goldPrice: {
    type: Number,
    require: true,
  },
});

const Weapon = mongoose.model("Weapon", WeaponSchema);
export default Weapon;

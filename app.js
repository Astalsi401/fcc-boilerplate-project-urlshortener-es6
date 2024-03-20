import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);
const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
});
const Url = mongoose.model("Url", urlSchema);

const createShortUrlAndSave = async (original_url) => {
  try {
    if (!/^(https?:)\/\/\w+/.test(original_url)) return { error: "invalid url" };
    const res = await Url.findOne({ original_url });
    if (res) return { original_url, short_url: res.short_url };
    const maxShortUrl = await Url.find()
      .sort({ short_url: -1 })
      .limit(1)
      .then((res) => res[0].short_url);
    const { short_url } = await Url.create({ original_url, short_url: maxShortUrl ? maxShortUrl + 1 : 1 });
    return { original_url, short_url };
  } catch (err) {
    return err;
  }
};

const getOriginalUrl = async (short_url) => {
  try {
    const res = await Url.findOne({ short_url });
    return res?.original_url || null;
  } catch (err) {
    return err;
  }
};

export { createShortUrlAndSave, getOriginalUrl };

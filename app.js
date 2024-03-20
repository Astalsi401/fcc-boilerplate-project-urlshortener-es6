import dotenv from "dotenv";
import mongoose, { Schema } from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);
const urlSchema = new Schema({
  original_url: String,
  short_url: Number,
});
const Url = mongoose.model("Url", urlSchema);

const createShortUrlAndSave = async (original_url, done) => {
  try {
    if (/^(https?:)\/\/w{3}\.\w+\.\w+/.test(original_url)) done(null, { error: "invalid url" });
    const res = await Url.findOne({ original_url });
    if (res) return done(null, { original_url, short_url: res.short_url });
    const maxShortUrl = await Url.find()
      .sort({ short_url: -1 })
      .limit(1)
      .then((res) => res[0].short_url);
    const { short_url } = await Url.create({ original_url, short_url: maxShortUrl ? maxShortUrl + 1 : 1 });
    done(null, { original_url, short_url });
  } catch (err) {
    done(err);
  }
};

const getOriginalUrl = async (short_url, done) => {
  try {
    const res = await Url.findOne({ short_url });
    if (!res) return done(null, null);
    done(null, res.original_url);
  } catch (err) {
    done(err);
  }
};

export { createShortUrlAndSave, getOriginalUrl };

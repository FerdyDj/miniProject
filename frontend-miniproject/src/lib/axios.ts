import axios from "axios";

const BASE_URL = process.env.NEXT_BASE_URL_BE!;

export default axios.create({
  baseURL: BASE_URL,
});

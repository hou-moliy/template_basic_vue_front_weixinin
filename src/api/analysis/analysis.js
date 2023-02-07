import * as axios from "../index.js";
import globalData from "../../globalData.js";
const baseUrl = globalData.portalUrl;

const send = params => axios.post(baseUrl + "/analysis/", params);
const channelRecord = params => axios.post(baseUrl + "/channel/record/", params);

export default {
  send,
  channelRecord,
};

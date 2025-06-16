export const convertImageToBase64 = (buffer, mimeType) => {
  const base64 = buffer.toString("base64");
  const dataUri = `data:${mimeType};base64,${base64}`;
  return dataUri;
};

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);
export const formatDate = (date) => {
  return dayjs(date).fromNow();
};

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";

dayjs.extend(relativeTime);
export const formatDate = (date) => {
  return dayjs(date).fromNow();
};

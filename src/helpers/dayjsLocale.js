import * as day from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

day.default.extend(utc);
day.default.extend(timezone);
day.default.tz.setDefault("Asia/Jakarta");

const dayjs = day.default.tz;

export default dayjs;
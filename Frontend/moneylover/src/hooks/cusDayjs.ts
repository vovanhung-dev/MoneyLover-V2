import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import {dateFormat} from "@/utils";

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
const dayFormat = "YYYY-MM-DD"

const parseDay = (day: string | Date) => {
	const parsedDate = dayjs(day, dateFormat);
	if (parsedDate.isValid()) {
		return parsedDate;
	} else {
		return dayjs(day, dayFormat).format(dateFormat);
	}
}
export default parseDay
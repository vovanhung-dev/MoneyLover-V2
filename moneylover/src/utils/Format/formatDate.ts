import dayjs from "dayjs";
import {dateFormat} from "@/utils";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export const formatDate = (date: Date | string | undefined) => {
	const Format = "YYYY-MM-DD"
	return dayjs(date, Format).format(dateFormat)
}

export const formatDateDetail = (date: Date | string | undefined) => {
	const Format = "YYYY-MM-DD"
	const formatDetail = "dddd, DD MMMM YYYY"
	return dayjs(date, Format).format(formatDetail)
}

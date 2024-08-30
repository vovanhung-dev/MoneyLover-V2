import dayjs from "dayjs";
import {antdOptions} from "@/model/interface.ts";
import {dateFormat} from "@/utils/index.ts";
import isoWeek from 'dayjs/plugin/isoWeek';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import weekday from "dayjs/plugin/weekday";
import {createdAt} from "@/modules/chat/function/chats.ts";

dayjs.extend(weekday);
dayjs.extend(isoWeek)
dayjs.extend(quarterOfYear)

interface dayOfWeek {
	value: string | number
	label: string
}

export const firstNLastNextMonth = () => {
	const now = dayjs();
	const currentMonth = now.month();
	const currentYear = now.year();

	const firstDayOfCurrentMonth = dayjs(new Date(currentYear, currentMonth, 1));

	const firstDayOfNextMonth = firstDayOfCurrentMonth.add(1, "month")
	return {
		start: firstDayOfNextMonth
	}
}


export const convertTimeStampToDate = (createdAt: createdAt) => {
	return new Date((createdAt?.seconds + createdAt?.nanoseconds * 10 ** -9) * 1000)
}

export const timeSendMess = (createdAt: createdAt) => {
	const timeSend = convertTimeStampToDate(createdAt)
	return {time: `${timeSend.getHours()}:${timeSend.getMinutes()}`, timer: timeSend}
}


export const similarTime = (firstTime: Date, secondTime: Date) => {
	const fTime = dayjs(firstTime)
	const sTime = dayjs(secondTime)
	const diffInMinutes = fTime.diff(sTime, 'minute');
	return Math.abs(diffInMinutes) <= 10
}

export const calculateElapsedTime = (createdAt: createdAt | string) => {
	let createdAtDate: Date
	if (typeof createdAt === "string") {
		createdAtDate = new Date(createdAt)
	} else {
		createdAtDate = convertTimeStampToDate(createdAt)
	}

	const now = new Date();
	const elapsedTimeInMs = now.getTime() - createdAtDate?.getTime();

	const seconds = Math.floor(elapsedTimeInMs / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);

	if (days > 0) return `${days}d`;
	if (hours > 0) return `${hours}h`;
	if (minutes > 0) return `${minutes}m`;
	return `${seconds < 0 ? 0 : seconds}s`;
};

export const getCurrentOneWeek = () => {
	const dayFormat = "DD/MM"
	const now = dayjs();
	const currentMonth = now.month();
	const currentYear = now.year();

	const startOfCurrentWeek = now.startOf('isoWeek');
	const endOfCurrentWeek = now.endOf('isoWeek');

	const firstDayOfCurrentMonth = dayjs(new Date(currentYear, currentMonth, 1));
	const lastDayOfCurrentMonth = dayjs(new Date(currentYear, currentMonth + 1, 0));

	const result: antdOptions[] = [
		{
			value: `${startOfCurrentWeek.format(dateFormat)}-${endOfCurrentWeek.format(dateFormat)}-This week`,
			label: `This week (${startOfCurrentWeek.format(dayFormat)}-${endOfCurrentWeek.format(dayFormat)})`,
		},
		// 	label: `Next week (${startOfNextWeek.format(dayFormat)}-${endOfNextWeek.format(dayFormat)})`,
		// },
		{
			value: `${firstDayOfCurrentMonth.format(dateFormat)}-${lastDayOfCurrentMonth.format(dateFormat)}-This month`,
			label: `This month (${firstDayOfCurrentMonth.format(dayFormat)}-${lastDayOfCurrentMonth.format(dayFormat)})`
		},
		{
			value: "custom",
			label: "Custom"
		}
	]

	return result

}


export const dayInWeek = () => {
	const startOfWeek = dayjs().startOf('week');
	const daysOfWeek: dayOfWeek[] = [];

	for (let i = 1; i < 8; i++) {
		daysOfWeek.push({
			label: startOfWeek.add(i, 'day').format('dddd'),
			value: i
		});
	}

	return daysOfWeek;
}

export const getDayAndPositionOfWeek = (day: Date | string | dayjs.Dayjs) => {
	const date = dayjs(day);

	const dayOfWeek = date.day();
	const daysOfWeekMap = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const dayOfWeekName = daysOfWeekMap[dayOfWeek];

	const startOfMonth = date.startOf("month");
	const weekOfMonth = date.isoWeek() - startOfMonth.isoWeek() + 1;

	return {
		dayName: dayOfWeekName,
		week: weekOfMonth,
		day: dayOfWeek
	}
}

export const parseFullForm = (date: Date | string | undefined) => {

	const today = dayjs().startOf("day")
	const dateCurrent = dayjs(date).startOf("day")
	if (!today.isSame(dateCurrent)) {
		return dayjs(date).format("dddd , DD-MM-YYYY")
	} else {
		return "Today  ,   " + dayjs(date).format("DD-MM-YYYY")
	}
}

export const getCurrentWeek = (monthStorage: string | null, yearStorage: string | null) => {
	const now = dayjs();
	const currentMonth = !monthStorage ? now.month() : parseInt(monthStorage) - 1; // Tháng bắt đầu từ 0 (tháng 1 là 0)
	const currentYear = !yearStorage ? now.year() : parseInt(yearStorage);

	const firstDayOfMonth = dayjs(new Date(currentYear, currentMonth, 1));
	const lastDayOfMonth = firstDayOfMonth.endOf('month');
	const daysOfWeekInMonth: string[] = [];
	let currentDay = firstDayOfMonth;
	let firstDayOfWeek = currentDay.date();
	while (currentDay.isBefore(monthStorage ? lastDayOfMonth : now) || currentDay.isSame(monthStorage ? lastDayOfMonth : now, 'day')) {
		const dayOfWeekIndex = currentDay.date();
		const dayOfWeekIndex2 = currentDay.day();
		if (dayOfWeekIndex2 === 0 || (dayOfWeekIndex === lastDayOfMonth.date() && lastDayOfMonth.isBefore(now))) {
			daysOfWeekInMonth.push(`${firstDayOfWeek},${dayOfWeekIndex}`)
			firstDayOfWeek = dayOfWeekIndex + 1
		}

		currentDay = currentDay.add(1, 'day');
	}
	return daysOfWeekInMonth
}

export const convertToCurrentDate = (date: Date | string) => dayjs(new Date().setDate(new Date(date).getDate()))
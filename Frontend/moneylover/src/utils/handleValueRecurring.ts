import {recurringRequest} from "@/model/interface.ts";

export const handleValueRecurring = (data: any) => {
	const {category, frequency, from_date} = data
	const type = category.split(".")[1]
	const category_id = category.split(".")[0]
	let result: recurringRequest = {...data, type: type, category: category_id, from_date, date: from_date}

	if (!data?.to_date && !data?.for_time) {
		result = {...result, forever: true}
	}

	if (frequency === "months") {
		const isString: boolean = typeof data?.day_of_month === 'string' || data?.day_of_month instanceof String
		const dayWeekOfMonth = isString ? data?.day_of_month.split(",")[0] : 0
		const occurrence_in_month = isString ? data?.day_of_month.split(",")[1] : data?.day_of_month
		result = {...result, date_of_week: dayWeekOfMonth, occurrence_in_month}
	} else if (frequency === "weeks") {
		const day_of_week = data?.date_of_week
		result = {...result, date_of_week: day_of_week}
	}
	console.log(result)
	return result
}
import {billResponse} from "@/modules/bill/model";
import dayjs from "dayjs";

const ClassifyBills = (bills: billResponse[]) => {
	const result = {
		due_bills: [] as billResponse[],
		today: [] as billResponse[],
		paid: [] as billResponse[],
		period: [] as billResponse[]
	}

	const todayDate = dayjs()

	bills.forEach((el) => {
		if (el.due_date) {
			result.due_bills.push(el)
		}
		if (dayjs(el.date).isSame(todayDate, 'day')) {
			result.today.push(el)
		}
		if (el.paid) {
			result.paid.push(el)
		} else {
			result.period.push(el)
		}
	})

	return result
}

export default ClassifyBills
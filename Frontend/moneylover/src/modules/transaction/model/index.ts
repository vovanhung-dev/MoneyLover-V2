interface timeTransaction {
	month: number
	year: number
	start: string,
	end: string,
	index: number
}

export interface balanceInMonth {
	openBalance: number
	endBalance: number
}


export interface filter {
	category: string | undefined;
	start: string | undefined;
	end: string | undefined;
	wallet: string | undefined
}

const getMonthDates = (startYear: number, startMonth: number, endYear: number, endMonth: number) => {
	const dates: timeTransaction[] = [];
	let index = 1
	for (let year = startYear; year <= endYear; year++) {
		const startM = year === startYear ? startMonth : 0;
		const endM = year === endYear ? endMonth : 11;

		for (let month = startM; month <= endM; month++) {
			index++
			const startDate = new Date(year, month, 2);
			const endDate = new Date(year, month + 1, 1); // Last day of the month

			dates.push({
				index: index,
				month: month + 1, // Adjust month for human-readable format
				year: year,
				start: startDate.toISOString().split('T')[0], // Convert to YYYY-MM-DD format
				end: endDate.toISOString().split('T')[0],
			});
		}
	}

	return dates;
};

// Get the current year and month
const now = new Date();
const currentYear = now.getFullYear();
const currentMonth = now.getMonth();

// Calculate start and end dates for each month from January 2023 to now
export const monthDates: timeTransaction[] = getMonthDates(2023, 0, currentYear, currentMonth);
export const monthCurrentYear: timeTransaction[] = getMonthDates(currentYear, 0, currentYear, 11);

// Output the results

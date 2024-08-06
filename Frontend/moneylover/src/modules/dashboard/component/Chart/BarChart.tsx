import {ApexOptions} from 'apexcharts';
import React, {useEffect, useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import {transactionResponse} from "@/model/interface.ts";
import {monthCurrentYear} from "@/modules/transaction/model";


const options: ApexOptions = {
	colors: ['#3C50E0', '#80CAEE'],
	chart: {
		fontFamily: 'Satoshi, sans-serif',
		type: 'bar',
		height: 335,
		stacked: true,
		toolbar: {
			show: false,
		},
		zoom: {
			enabled: false,
		},
	},

	responsive: [
		{
			breakpoint: 1536,
			options: {
				plotOptions: {
					bar: {
						borderRadius: 0,
						columnWidth: '25%',
					},
				},
			},
		},
	],
	plotOptions: {
		bar: {
			horizontal: false,
			borderRadius: 0,
			columnWidth: '25%',
			borderRadiusApplication: 'end',
			borderRadiusWhenStacked: 'last',
		},
	},
	dataLabels: {
		enabled: false,
	},

	xaxis: {
		categories: ['Jan', 'Feb', 'Mar', 'Apr', "May", 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
	},
	legend: {
		position: 'top',
		horizontalAlign: 'left',
		fontFamily: 'Satoshi',
		fontWeight: 500,
		fontSize: '14px',

		markers: {
			radius: 99,
		},
	},
	fill: {
		opacity: 1,
	},
};

interface BarChartState {
	series: {
		name: string;
		data: number[];
	}[];
}

enum typeCategory {
	Expense = "Expense",
	Income = "Income",
	Deb = "Debt_Loan"
}

interface props {
	tran: transactionResponse[]
}

const BarChart: React.FC<props> = ({tran}) => {


	useEffect(() => {
		if (!tran) return;

		const dataDay = tran.reduce((acc, obj) => {
			const {category, date, amount, exclude} = obj;
			const {categoryType} = category;
			const existingEntry = acc.find(item => item.category.categoryType === categoryType && item.date === date);

			const updatedAmount = (categoryType === typeCategory.Expense) && !exclude ? -amount : (categoryType === typeCategory.Income) && !exclude ? amount : 0;

			if (existingEntry) {
				existingEntry.amount += updatedAmount;
			} else {
				acc.push({...obj, amount: updatedAmount});
			}

			return acc;
		}, [] as transactionResponse[]);

		const dataChart = () => {
			const result: BarChartState = {
				series: [
					{name: "Expense", data: Array(12).fill(0)},
					{name: "Income", data: Array(12).fill(0)}
				]
			};

			const monthIndexMap = monthCurrentYear.reduce((acc, m, idx) => {
				// @ts-ignore
				acc[m.month] = idx;
				return acc;
			}, {});

			dataDay.forEach(({date, amount, category}) => {
				const monthIndex = new Date(date).getMonth();
				if (monthIndex in monthIndexMap) {
					const seriesIndex = category.categoryType === typeCategory.Expense ? 0 : 1;
					result.series[seriesIndex].data[monthIndex] += amount;
				}
			});

			return result;
		};

		setState(dataChart());
	}, [tran]);

	const [state, setState] = useState<BarChartState>({
		series: [
			{
				name: "Expense",
				data: Array(12).fill(0)
			},
			{
				name: "Income",
				data: Array(12).fill(0)
			},
		]
	});

	const handleReset = () => {
		setState((prevState) => ({
			...prevState,
		}));
	};
	handleReset;

	return (
		<div
			className="col-span-12 rounded-sm xl:col-span-4">
			<div className="mb-4 justify-between gap-4 sm:flex">
				<div>
					<h4 className="text-xl font-semibold text-black ">
						Transaction
					</h4>
				</div>
			</div>

			<div>
				<div id="BarChart" className="-ml-5 -mb-9">
					<ReactApexChart
						options={options}
						series={state.series}
						type="bar"
						height={350}
					/>
				</div>
			</div>
		</div>
	);
};

export default BarChart;

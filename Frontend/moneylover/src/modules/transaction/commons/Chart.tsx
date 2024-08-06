import {ApexOptions} from "apexcharts";
import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
import {getCurrentWeek} from "@/utils";
import {debt_loan_type, transactionResponse, typeCategory} from "@/model/interface.ts";
import dayjs from "dayjs";


interface BarChartState {
	series: {
		name: string;
		data: number[];
	}[];
}

interface props {
	tran: transactionResponse[]
}

const TransitionChart: React.FC<props> = ({tran}) => {
	const [categories, setCategories] = useState<string[]>([])
	useEffect(() => {
		setCategories(getCurrentWeek())
	}, []);

	const options: ApexOptions = {
		colors: ['#3C50E0', '#80CAEE', "#2e5b73"],
		chart: {
			fontFamily: 'Satoshi, sans-serif',
			type: 'bar',
			height: 250,
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
			categories: [...categories],
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


	useEffect(() => {
		const now = dayjs();
		const currentMonth = now.month(); // Tháng bắt đầu từ 0 (tháng 1 là 0)
		const currentYear = now.year();

		const result1: BarChartState = {
			series: [
				{
					name: "Expense",
					data: Array(categories.length).fill(0)
				},
				{
					name: "Income",
					data: Array(categories.length).fill(0)
				},
				{
					name: "Deb_Loan",
					data: Array(categories.length).fill(0)
				}
			]
		}
		categories.forEach((categoryRange, i) => {
			const [start, end] = categoryRange.split(",").map(Number);
			const startWeek = dayjs(new Date(currentYear, currentMonth, start));
			const endWeek = dayjs(new Date(currentYear, currentMonth, end));

			tran.forEach(obj => {
				const objDate = dayjs(obj.date);
				if (objDate.isAfter(startWeek) && objDate.isBefore(endWeek) || objDate.isSame(endWeek) || objDate.isSame(startWeek)) {
					const amount = obj.amount;
					const categoryType = obj.category.categoryType;
					console.log(obj)
					if (!obj.exclude) {
						if (categoryType === typeCategory.Expense) {
							result1.series[0].data[i] -= amount;
						} else if (categoryType === typeCategory.Income) {
							result1.series[1].data[i] += amount;
						} else if (categoryType === typeCategory.Deb && obj.category.debt_loan_type === debt_loan_type.debt) {
							result1.series[2].data[i] += amount
						} else {
							result1.series[2].data[i] -= amount
						}
					}
				}
			});
		});

		setState(result1)
	}, [tran, categories]);


	const [state, setState] = useState<BarChartState>({
		series: [
			{
				name: "Expense",
				data: Array(categories.length).fill(0)
			},
			{
				name: "Income",
				data: Array(categories.length).fill(0)
			},
			{
				name: "Deb_Loan",
				data: Array(categories.length).fill(0)
			}
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

export default TransitionChart;
import {ApexOptions} from "apexcharts";
import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
import {transactionResponse} from "@/model/interface.ts";
import {CalculateCategoriesChart, TranChartDate, TranChartPeriod} from "@/modules/transaction/function/CalculateToChart.ts";
import {getCurrentWeek} from "@/utils/day.ts";


interface BarChartState {
	series: {
		name: string;
		data: number[];
	}[];
}

interface props {
	tran: transactionResponse[] | undefined
	type?: string
}

const TransitionChart: React.FC<props> = ({tran, type}) => {
	const [categories, setCategories] = useState<string[]>([])
	useEffect(() => {
		const month = sessionStorage.getItem("currentMonth")
		const year = sessionStorage.getItem("currentYear")
		setCategories(type === "date" ? CalculateCategoriesChart(tran) : getCurrentWeek(month, year))
	}, [tran]);

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

		},
		fill: {
			opacity: 1,
		},
	};


	useEffect(() => {
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
		type != "date" ? TranChartPeriod(categories, tran, result1) : TranChartDate(categories, tran, result1)

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
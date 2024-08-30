import {ApexOptions} from "apexcharts";
import React, {useEffect, useState} from "react";
import ReactApexChart from "react-apexcharts";
import {transactionResponse} from "@/model/interface.ts";
import {CalculateCategoriesChart, TranIncomePie} from "@/modules/transaction/function/CalculateToChart.ts";
import {getCurrentWeek} from "@/utils/day.ts";

interface props {
	tran: transactionResponse[] | undefined
	type?: string
}


const TransitionPieChart: React.FC<props> = ({tran, type}) => {
	const [label, setLabel] = useState<string[]>([]);
	const [seriesData, setSeriesData] = useState<number[]>([]);

	useEffect(() => {
		const month = sessionStorage.getItem("currentMonth")
		const year = sessionStorage.getItem("currentYear")
		setLabel(type === "date" ? CalculateCategoriesChart(tran) : getCurrentWeek(month, year))
	}, [tran]);


	useEffect(() => {
		setSeriesData(TranIncomePie(label, tran))
	}, [tran, label]);
	const options: ApexOptions = {
		chart: {
			width: 380,
			type: 'donut',
		},
		labels: label,
		legend: {
			position: 'top',
			horizontalAlign: 'right',
			fontFamily: 'Satoshi',
			fontWeight: 500,
			fontSize: '14px',
		}, responsive: [{
			breakpoint: 480,
			options: {
				chart: {
					width: 200
				},
				legend: {
					position: 'bottom'
				}
			}
		}]
	}

	return (
		<div className="col-span-12 rounded-sm xl:col-span-4">
			<div className="mb-4 justify-between gap-4 sm:flex">
				<div>
					<h4 className="text-xl font-semibold text-black ">
						Transaction
					</h4>
				</div>
			</div>

			<div>
				<div id="DonutChart" className="-ml-5 -mb-9">
					<ReactApexChart
						options={options}
						series={seriesData}
						type="donut" // Change to 'pie' if you want a pie chart
						height={350}
						width={380}
					/>
				</div>
			</div>
		</div>
	);
};

export default TransitionPieChart;

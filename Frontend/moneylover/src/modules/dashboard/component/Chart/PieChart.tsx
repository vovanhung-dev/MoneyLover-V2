import {ApexOptions} from 'apexcharts';
import React, {useState} from 'react';
import ReactApexChart from 'react-apexcharts';

interface PieChartState {
	series: number[];
}

const options: ApexOptions = {
	chart: {
		fontFamily: 'Satoshi, sans-serif',
		type: 'donut',
	},
	colors: ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'],
	labels: ['Desktop', 'Tablet', 'Mobile', 'Unknown'],
	legend: {
		show: true,
		position: 'bottom',
	},

	plotOptions: {
		pie: {
			donut: {
				size: '80%',
				background: 'transparent',
			},
		},
	},
	dataLabels: {
		enabled: false,
	},
	responsive: [
		{
			breakpoint: 2600,
			options: {
				chart: {
					width: 330,
				},
			},
		},
		{
			breakpoint: 1280,
			options: {
				chart: {
					width: 300,
				},
			},
		},
		{
			breakpoint: 640,
			options: {
				chart: {
					width: 150,
				},
			},
		},
	],
};

const PieChart: React.FC = () => {
	const [state, setState] = useState<PieChartState>({
		series: [65, 34, 12, 56],
	});

	const handleReset = () => {
		setState((prevState) => ({
			...prevState,
			series: [65, 34, 12, 56],
		}));
	};
	handleReset;

	return (
		<div className="rounded-sm  xl:col-span-5">
			<h5 className="text-sm mb-10 flex-center font-semibold text-black ">
				Income
			</h5>

			<div className="mb-2">
				<div id="PieChart" className="mx-auto flex justify-center">
					<ReactApexChart
						options={options}
						series={state.series}
						type="donut"
					/>
				</div>
			</div>
		</div>
	);
};

export default PieChart;


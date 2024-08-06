import UserLayout from "@/layout/userLayout.tsx";
import {IBudget, ITransaction, Saving} from "@/assets";
import {BreakCrumb} from "@/components";
import {CardDashBoard} from "@/commons";
import {routePath} from "@/utils";
import useHomePage from "../function";
import {BarChart} from "../component";
import {useWallet} from "@/context/WalletContext.tsx";
import {useEffect, useMemo, useState} from "react";
import {convertMoney, NumberFormatter} from "@/utils/Format";
import {typeCategory} from "@/model/interface.ts";
import {useWalletCurrency} from "@/hooks/currency.ts";

const DashBoard = () => {
	const {budgets, transactions} = useHomePage()
	const {wallets} = useWallet()
	const currency = useWalletCurrency();
	const [totalWallet, setTotalWallet] = useState<number>(0);
	const [totalTran, setTotalTran] = useState<number>(0);


	useEffect(() => {
		const calculateTotalWallet = async () => {
			const promises = wallets.map(wallet => convertMoney(wallet.balance, wallet.currency, currency));
			const results = await Promise.all(promises);
			const total = results.reduce((acc, curr) => acc + curr, 0);
			setTotalWallet(total);
		};

		calculateTotalWallet();
	}, [wallets, currency]);


	const totalBudget = useMemo(() => budgets?.reduce((curr, total) => curr + total.amount, 0), [budgets])

	useEffect(() => {
		const result = transactions?.reduce((curr, total) => {
			if (total.category.categoryType === typeCategory.Expense) {
				curr -= total.amount
			} else {
				curr += total.amount
			}
			return curr
		}, 0)
		setTotalTran(result)
	}, [transactions]);


	return <UserLayout>
		<BreakCrumb pageName={""}/>
		<div className={`w-full h-screen grid md:grid-rows-4 gap-6`}>
			<div className={`grid grid-cols-1 md:grid-cols-12 gap-6 row-span-1 h-auto`}>
				<div
					className={`shadow-4 bg-white rounded-2xl md:col-span-6 py-8  xl:col-span-8 flex flex-col-reverse md:flex-row items-center justify-between px-6`}>
					<div className={`flex flex-col gap-5`}><span
						className={`text-3xl font-semibold`}>Welcome back </span><span
						className={`text-xl font-normal text-bodydark2`}>Total amount of you is {<NumberFormatter number={totalWallet}/>}</span>
					</div>
					<img src={Saving} alt="" className={`w-40 h-40`}/>
				</div>
				<div className={`shadow-4 bg-white rounded-2xl md:col-span-3 xl:col-span-2`}>
					<CardDashBoard link={routePath.transaction.path} label={`Transaction`} img={ITransaction} amount={totalTran}
								   total={transactions.length}/>
				</div>
				<div className={`shadow-4 bg-white rounded-2xl md:col-span-3 xl:col-span-2`}>
					<CardDashBoard link={routePath.budget.path} label={`Budget`} img={IBudget} amount={totalBudget} total={budgets?.length}/>
				</div>
			</div>
			<div className={`row-span-2 h-2/3 gap-6 grid md:grid-cols-1`}>
				<div className={` bg-white shadow-3 rounded-2xl p-4`}>
					<BarChart tran={transactions}/>
				</div>
			</div>
		</div>
	</UserLayout>
}
export default DashBoard
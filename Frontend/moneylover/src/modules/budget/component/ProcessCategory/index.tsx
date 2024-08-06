import CardCategory from "@/modules/budget/commons/CardCategory";
import {CheckSpentOver} from "@/modules/budget/function/checkSpentOver.ts";
import {PercentAndTotalAmountTran} from "@/modules/budget/function/percentAndTotalAmountTran.ts";
import {useBudgetStore} from "@/modules/budget/store";
import {ModalPopUp} from "@/commons";
import DetailBudgetCate from "@/modules/budget/component/DetailBudgetCate";
import {budgetStoreDetail} from "@/modules/budget/store/modalBudget.ts";
import React, {useState} from "react";
import {BudgetSimilar, cateSimilar} from "@/modules/budget/interface";
import useRequest from "@/hooks/useRequest.ts";
import {del} from "@/libs/api.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {useQueryClient} from "@tanstack/react-query";

interface props {
	price: string | number | undefined,
	percent: number
	category: cateSimilar
	budgetCurrent: BudgetSimilar
	totalLeft: number
	isOver: boolean
	id: string
}

const ProcessCategory = () => {

	const queryClient = useQueryClient()
	const {transactionSimilar} = PercentAndTotalAmountTran()
	const [detailBudget, setDetailBudget] = useState<props>()
	const {budgetSelect} = useBudgetStore()
	const {cancelIsShow, setIsShow, isShowBudgetDetail} = budgetStoreDetail()

	const {mutate: deleteBudget} = useRequest({
		mutationFn: (values: string) => {
			return del({
				url: `budget/delete/${values}`,
				data: values
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.budgets])
			cancelIsShow()
		}
	})
	const clickDeleteBudget = (id: string | undefined) => {
		deleteBudget(id)
	}

	const handleShowDetail = (budget: BudgetSimilar, cate: cateSimilar, price: string | number | undefined, percent: number, totalLeft: number, isOver: boolean, id: string) => {
		setDetailBudget({
			budgetCurrent: budget,
			category: cate,
			percent: percent,
			price: price,
			totalLeft,
			isOver,
			id
		})
		setIsShow()
	}
	return <>
		<ModalPopUp isModalOpen={isShowBudgetDetail} showOke={false} handleCancel={cancelIsShow} title={""}>
			<DetailBudgetCate category={detailBudget?.category} budgetCurrent={detailBudget?.budgetCurrent} price={detailBudget?.price}
							  percent={detailBudget?.percent} isOver={detailBudget?.isOver}
							  totalLeft={detailBudget?.totalLeft} deleteBudget={clickDeleteBudget} id={detailBudget?.id}/>
		</ModalPopUp>
		{budgetSelect?.category?.map((el) => {
			const tran = transactionSimilar.find((t) => t.category.id === el.id)
			const {spentOver, percent, totalLeft, isOver} = CheckSpentOver(tran?.amount || 0, el?.amountBudget)
			return <div key={el.id} className={`w-full flex-center`}
						onClick={() => handleShowDetail(budgetSelect, el, tran?.amount, percent, totalLeft, isOver, el?.idBudget)}>
				<CardCategory className={`w-[calc(100%+40px)] md:w-2/3 cursor-pointer`} img={tran?.category.categoryIcon || el.categoryIcon}
							  name={tran?.category.name || el.name}
							  amount={tran?.amount || 0}
							  isOver={isOver} spentOver={spentOver} percent={percent} totalLeft={totalLeft}/>
			</div>
		})}
	</>
}

export default React.memo(ProcessCategory)
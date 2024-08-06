import UserLayout from "@/layout/userLayout.tsx";
import {BreakCrumb, BudgetForm} from "@/components";
import {useEffect, useState} from "react";
import {Button, Empty} from "antd";
import {ModalPopUp} from "@/commons";
import {FormProvider, useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {budgetSchema} from "@/libs/schema.ts";
import useRequest from "@/hooks/useRequest.ts";
import {post} from "@/libs/api.ts";
import {BudgetRequest} from "../interface";
import TopProcess from "../component/TopProcess";
import ProcessCategory from "../component/ProcessCategory";
import SliderBudget from "@/modules/budget/component/SliderBudget";
import BudgetHistory from "@/modules/budget/component/ShowBudgetHistory";
import useBudget from "@/modules/budget/function";
import {useWallet} from "@/context/WalletContext.tsx";
import {useNavigate} from "react-router-dom";
import {FormatValueInput} from "@/utils/Format/fortmat.value.input.ts";
import {useQueryClient} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {handleSubmitBudget} from "@/modules/budget/function/handleBudget.ts";
import {useWalletStore} from "@/zustand/budget.ts";
import {showModalNoWallet} from "@/utils/showModalNoWallet.tsx";


const Budget = () => {
	const {walletSelect} = useWalletStore()
	const navigate = useNavigate()
	const {wallets} = useWallet()
	const queryClient = useQueryClient()

	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [isHistory, setIsHistory] = useState<boolean>(false);
	const methods = useForm({mode: "onChange", resolver: yupResolver(budgetSchema), defaultValues: {amount: 0}})

	const {mutate: createBudget} = useRequest({
		mutationFn: (values: BudgetRequest) => {
			console.log(values)
			return post({
				url: "budget/add",
				data: values
			})
		},
		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.budgets])
			handleCancel()
			methods.reset()
		}
	})
	const {budgets} = useBudget(walletSelect?.id)

	const amount = methods.watch("amountDisplay")

	const showModal = () => {
		showModalNoWallet(wallets, navigate, setIsModalOpen)
	}

	useEffect(() => {
		FormatValueInput(amount, methods.setValue, walletSelect?.currency)
	}, [amount, methods, walletSelect]);


	const handleOk = (data: any) => {
		handleSubmitBudget(data, budgets, createBudget)
	}
	const handleCancel = () => {
		setIsModalOpen(false);
		setIsHistory(false)
	};
	return <UserLayout>
		<BreakCrumb pageName={"Budget"}/>
		<div className={`container-wrapper-auto relative p-10`}>
			<div className={`flex-center border-b-2 mt-20 md:mt-0 translate-x-[10px] pb-5 mb-10 md:mx-50`}>
				<Button onClick={() => showModal()} size={`large`}>Add budget</Button>
			</div>
			<div className={`absolute top-[10px] right-[10px]`}><Button className={` md:text-lg text-xs`} onClick={() => setIsHistory(!isHistory)}
																		size={`large`}>History
				budget
				complete</Button></div>
			{budgets?.length > 0 ?
				<>
					<SliderBudget/>
					<div className={`flex-center flex-col w-full mt-15`}>
						<TopProcess/>
						<ProcessCategory/>
					</div>
				</>
				:
				<div className={`p-10 shadow-3`}>
					<Empty/>
				</div>
			}
		</div>
		<ModalPopUp isModalOpen={isHistory} handleOk={handleCancel} handleCancel={handleCancel} title={""}>
			<div className={`m-4 mt-8`}>
				<BudgetHistory isFetch={isHistory}/>
			</div>
		</ModalPopUp>
		<ModalPopUp isModalOpen={isModalOpen} handleOk={methods.handleSubmit(handleOk)} handleCancel={handleCancel} title={"Add budget"}>
			<FormProvider {...methods}>
				<BudgetForm/>
			</FormProvider>
		</ModalPopUp>
	</UserLayout>
}

export default Budget
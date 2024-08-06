import {createContext, useContext, useMemo, useState} from "react";
import {useQueries, useQueryClient} from "@tanstack/react-query";
import {get, post} from "@/libs/api.ts";
import {Category} from "@/model/interface.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {ModalPopUp} from "@/commons";
import {FormProvider, useForm} from "react-hook-form";
import CreateCateForm from "@/components/Form/CreateCateForm.tsx";
import useRequest from "@/hooks/useRequest.ts";
import {yupResolver} from "@hookform/resolvers/yup";
import {categorySchema} from "@/libs/schema.ts";

interface props {
	categories: Category[];
	isFetching: boolean;
	changeType: (el: string) => void
	openModal: () => void
	categoryAll: Category[]
}

interface propsChild {
	children: React.ReactNode
}

interface cateReq {
	type: string
	icon: string
	name: string
}

const categoryContext = createContext<props | undefined>(undefined);

export const CategoryProvider: React.FC<propsChild> = ({children}) => {
	const queryClient = useQueryClient()
	const Methods = useForm({mode: "onChange", resolver: yupResolver(categorySchema)})
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
	const [type, setType] = useState<string>()

	const fetchCategory = (key: any) => {
		return get({url: "categories", params: {type: key.queryKey[1]}});
	};
	const fetchCateNoType = () => {
		return get({url: "categories/all"});
	};

	const handleTypeChange = (type: string) => {
		setType(type)
	}

	const openModalCreate = () => {
		setIsModalOpen(true)
	}

	const data = useQueries({
		queries: [
			{
				queryKey: [nameQueryKey.categories, type],
				queryFn: fetchCategory,
			},
			{
				queryKey: [nameQueryKey.category],
				queryFn: fetchCateNoType,
			},
		]
	});

	const isFetching = data[0]?.isFetching
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const categoryData = data[0]?.data?.data ?? [];

	const categoryAll = data[1]?.data?.data ?? []
	const {mutate: createCategory} = useRequest({
		mutationFn: (values: cateReq) => {
			return post({
				url: "category/add",
				data: values
			})
		},

		onSuccess: () => {
			// @ts-ignore
			queryClient.invalidateQueries([nameQueryKey.categories])
			Methods.reset()
			setIsModalOpen(false)
		}
	})

	const handleOke = (data: any) => {
		createCategory(data)
	}

	const value: props = useMemo(() => ({
		categories: categoryData,
		isFetching: false,
		changeType: handleTypeChange,
		openModal: openModalCreate,
		categoryAll
	}), [categoryData, isFetching]);

	return (
		<categoryContext.Provider value={value}>
			<ModalPopUp isModalOpen={isModalOpen} handleOk={Methods.handleSubmit(handleOke)} handleCancel={() => setIsModalOpen(false)}>
				<FormProvider {...Methods}>
					<CreateCateForm/>
				</FormProvider>
			</ModalPopUp>
			{children}
		</categoryContext.Provider>
	);
};

export const useCategory = (): props => {
	const context = useContext(categoryContext);
	if (context === undefined) {
		throw new Error("useCategory must be used within a CategoryProvider");
	}
	return context;
};

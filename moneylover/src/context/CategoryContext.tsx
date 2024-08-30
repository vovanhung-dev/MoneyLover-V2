import {createContext, useContext, useMemo, useState} from "react";
import {useQueries} from "@tanstack/react-query";
import {get} from "@/libs/api.ts";
import {Category} from "@/model/interface.ts";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";

interface CategoryFetchProps {
	categories: Category[];
	isFetching: boolean;
	changeType: (el: string) => void;
	categoryAll: Category[];
}

interface CategoryFetchProviderProps {
	children: React.ReactNode;
}

const CategoryFetchContext = createContext<CategoryFetchProps | undefined>(undefined);

export const CategoryFetchProvider: React.FC<CategoryFetchProviderProps> = ({children}) => {
	const [type, setType] = useState<string>();

	const fetchCategory = (key: any) => {
		return get({url: "categories", params: {type: key.queryKey[1]}});
	};

	const fetchCateNoType = () => {
		return get({url: "categories", params: {type: "All"}});
	};

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
		],
	});

	const isFetching = data[0]?.isFetching;
	const categoryData = data[0]?.data?.data ?? [];
	const categoryAll = data[1]?.data?.data ?? [];

	const value: CategoryFetchProps = useMemo(() => ({
		categories: categoryData,
		isFetching: !!isFetching,
		changeType: setType,
		categoryAll,
	}), [categoryData, isFetching]);

	return (
		<CategoryFetchContext.Provider value={value}>
			{children}
		</CategoryFetchContext.Provider>
	);
};

export const useCategoryFetch = (): CategoryFetchProps => {
	const context = useContext(CategoryFetchContext);
	if (context === undefined) {
		throw new Error("useCategoryFetch must be used within a CategoryFetchProvider");
	}
	return context;
};

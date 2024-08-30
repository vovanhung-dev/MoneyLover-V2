import {InputController, SelectInput} from "@/commons";
import {useCategoryFetch} from "@/context/CategoryContext.tsx";
import React, {useMemo} from "react";
import {parseToAllCate} from "@/model/interface.ts";
import {DatePicker} from "antd";


const FilterForm = React.memo(() => {


	const {categoryAll} = useCategoryFetch()
	const newCate = useMemo(() => parseToAllCate(categoryAll), [categoryAll])
	return <>
		<InputController name={"category"}
						 render={({field}) => <SelectInput className={`w-2/5`} field={field} options={newCate} title={"Select category"}/>}/>
		<InputController name={"date"}
						 render={({field}) => <DatePicker {...field}/>}/>

	</>
})

export default FilterForm
import {InputController, SelectInput} from "@/commons";
import {useCategory} from "@/context/CategoryContext.tsx";
import React, {useMemo} from "react";
import {parseToAllCate} from "@/model/interface.ts";


const FilterForm = React.memo(() => {


	const {categoryAll} = useCategory()
	const newCate = useMemo(() => parseToAllCate(categoryAll), [categoryAll])
	return <>
		<InputController name={"category"}
						 render={({field}) => <SelectInput className={`w-2/5`} field={field} options={newCate} title={"Select category"}/>}/>


	</>
})

export default FilterForm
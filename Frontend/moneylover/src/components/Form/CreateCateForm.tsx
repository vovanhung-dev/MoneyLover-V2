import {Badge, Input, Radio, RadioChangeEvent} from "antd";
import {InputController} from "@/commons";
import {useEffect, useState} from "react";
import {get} from "@/libs/api.ts";
import {useQuery} from "@tanstack/react-query";
import {nameQueryKey} from "@/utils/nameQueryKey.ts";
import {ResponseData} from "@/model/interface.ts";
import {check} from "@/assets";

const optionsTypCate = [
	{label: 'Expense', value: 'Expense'},
	{label: 'InCome', value: 'Income'},
];

interface IconsRes {
	id: string;
	path: string;
}

const fetchIcon = (): Promise<ResponseData> => {
	return get({url: "icons"});
};

const CreateCateForm = () => {
	const {data} = useQuery({queryKey: [nameQueryKey.icons], queryFn: fetchIcon});
	const [icons, setIcons] = useState<IconsRes[]>([]);
	const [typeCate, setTypeCate] = useState<string>("Expense");
	const [showIcon, setShowIcon] = useState<boolean>(false);
	const [selectIcon, setSelectIcon] = useState<string>("");

	useEffect(() => {
		if (data?.data) {
			setIcons(data.data);
		}
	}, [data]);

	const onChangeTypeCate = ({target: {value}}: RadioChangeEvent) => {
		setTypeCate(value);
	};

	const handleIconClick = (iconPath: string) => {
		setSelectIcon(iconPath);
		setShowIcon(false);
	};

	return (
		<form className="flex flex-col gap-4 mt-4">
			<InputController
				label="Category type"
				name="type"
				defaultValue={typeCate}
				render={({field}) => (
					<Radio.Group
						{...field}
						options={optionsTypCate}
						onChange={onChangeTypeCate}
						value={typeCate}
						optionType="button"
						buttonStyle="solid"
					/>
				)}
			/>

			<InputController
				label="Icon"
				name="icon"
				defaultValue={selectIcon}
				render={({field}) => (
					<div onClick={() => setShowIcon(!showIcon)}>
						{selectIcon ?
							<img
								src={selectIcon}
								alt=""
								className="w-15 h-15 rounded-full shadow-3 p-1 cursor-pointer"
								{...field}
							/> : <div className={`w-15 h-15 rounded-full bg-neutral-500`}></div>}
					</div>
				)}
			/>

			{showIcon && (
				<div className="grid grid-cols-4 gap-4 p-4 shadow-3">
					{icons.map((el) => (
						<div key={el.id} onClick={() => handleIconClick(el.path)}>
							<Badge count={selectIcon === el.path ? <img src={check} alt="" className="bg-red-600 rounded-full p-1"/> : 0}>
								<img src={el.path} alt="" className="w-10 h-10 rounded-full cursor-pointer"/>
							</Badge>
						</div>
					))}
				</div>
			)}

			<InputController
				label="Name"
				name="name"
				render={({field}) => <Input placeholder="name" {...field} />}
			/>
		</form>
	);
};

export default CreateCateForm;
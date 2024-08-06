import {filterOptionSelect} from "@/utils";
import {Select, Space} from "antd";
import {CategoryNew, Categoryoptions} from "@/model/interface.ts";

interface props {
	field: any
	options: any
	title: string
	defaultValue?: string
	className?: string
	onChange?: (value: string) => void
}

const SelectInput: React.FC<props> = ({field, className, onChange, options, title, defaultValue}) => {
	const getEmojiByValue = (value: any) => {
		const option = options.find((opt: {
			value: any;
		}) => opt.value === value) || options.flatMap((opt: Categoryoptions) => opt.options).find((el: CategoryNew) => el.value === value)

		return option ? option.emoji : "https://img.icons8.com/?size=100&id=13016&format=png&color=000000";
	};

	return (
		onChange ?
			<Select
				{...field}
				className={className}
				showSearch
				labelRender={(label) => (
					<Space>
          <span role="img">
            <img
				className="w-5 h-5 rounded-full"
				src={getEmojiByValue(label.value) ?? "https://img.icons8.com/?size=100&id=13016&format=png&color=000000"}
				alt=""
			/>
          </span>
						{label.label}
					</Space>
				)}
				value={defaultValue}
				onChange={onChange}
				placeholder={title}
				optionFilterProp="children"
				filterOption={filterOptionSelect}
				options={options}
				optionRender={(option) => {
					return <Space>
          <span role="img">
            <img
				className="w-5 h-5 rounded-full"
				src={option.data.emoji ?? "https://img.icons8.com/?size=100&id=13016&format=png&color=000000"}
				alt=""
			/>
          </span>
						{option.label}
					</Space>
				}}
			/> : <Select
				{...field}
				className={className}
				showSearch
				labelRender={(label) => (
					<Space>
          <span role="img">
            <img
				className="w-5 h-5 rounded-full"
				src={getEmojiByValue(label.value) ?? "https://img.icons8.com/?size=100&id=13016&format=png&color=000000"}
				alt=""
			/>
          </span>
						{label.label}
					</Space>
				)}
				placeholder={title}
				optionFilterProp="children"
				filterOption={filterOptionSelect}
				options={options}
				optionRender={(option) => {
					return <Space>
          <span role="img">
            <img
				className="w-5 h-5 rounded-full"
				src={option.data.emoji ?? "https://img.icons8.com/?size=100&id=13016&format=png&color=000000"}
				alt=""
			/>
          </span>
						{option.label}
					</Space>
				}}
			/>
	);
}

export default SelectInput
import React, {useEffect} from 'react';
import {Controller, useFormContext, FieldValue} from 'react-hook-form';
import cn from "@/utils/cn";

interface FormControllerProps {
	name: string;
	render: (props: { field: FieldValue<any> }) => JSX.Element;
	defaultValue?: any
	label?: string
	className?: string
	isReset?: boolean
	value?: any
}

const FormController: React.FC<FormControllerProps> = ({name, value, isReset, className, label, render, defaultValue}) => {
	const {control, setValue, formState: {errors}} = useFormContext()
	useEffect(() => {
		if (value || isReset) {
			setValue(name, value);
		}
	}, [value, name, setValue]);
	return <>
		{label &&
            <label className={cn("mb-[-10px] block font-medium text-black", className)}>
				{label}
            </label>}
		{errors[name] && (
			<span className="mb-[-10px] text-red-500">{errors[name]?.message?.toString()}</span>
		)}
		<Controller
			name={name}
			control={control}
			defaultValue={defaultValue}
			render={render}
		/>
	</>
}

export default FormController;
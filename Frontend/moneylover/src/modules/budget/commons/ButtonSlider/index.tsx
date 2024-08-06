interface props {
	disabled: boolean
	onClick: () => void
	img: string
}

const ButtonSlider: React.FC<props> = ({disabled, onClick, img}) => {

	return <>
		<button className={``} disabled={disabled} onClick={onClick}>
			<img src={img} alt=''
			/>
		</button>
	</>
}

export default ButtonSlider
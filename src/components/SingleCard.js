export default function SingleCard({
	card,
	theme,
	handleChoice,
	flipped,
	disabled,
}) {
	const handleClick = () => {
		if (!disabled) {
			handleChoice(card);
		}
	};

	return (
		<div className="card">
			<div className={flipped ? "flipped" : ""}>
				<img
					className="front"
					src={`/img/${theme}/${card.src}`}
					alt="card front"
				/>
				<img
					className="back"
					src={`/img/cover4.jpg`}
					onClick={handleClick}
					alt="cover"
				/>
			</div>
		</div>
	);
}

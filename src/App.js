import { useState, useEffect } from "react";
import SingleCard from "./components/SingleCard";

const cardImages = [
	{ src: "/1.jpg", matched: false },
	{ src: "/2.jpg", matched: false },
	{ src: "/3.jpg", matched: false },
	{ src: "/4.jpg", matched: false },
	{ src: "/5.jpg", matched: false },
	{ src: "/6.jpg", matched: false },
];

const themes = [
	{ name: "diamond", bgColor: "" },
	{ name: "kingdom", bgColor: "" },
	// { name: "war", bgColor: "" },
	{ name: "war2", bgColor: "" },
	// { name: "blob", bgColor: "" },
	{ name: "desert", bgColor: "" },
	{ name: "fastfood", bgColor: "" },
	{ name: "fruit", bgColor: "" },
	{ name: "objects", bgColor: "" },
	{ name: "ocean", bgColor: "" },
	{ name: "ocean2", bgColor: "" },
	// { name: "pets", bgColor: "" },
	{ name: "rings", bgColor: "" },
	{ name: "tree", bgColor: "" },
	{ name: "witchcraft", bgColor: "" },
];

function App() {
	const [cards, setCards] = useState([]);
	const [level, setLevel] = useState(
		localStorage.getItem("memoryverseLevel") || 0
	);
	const [theme, setTheme] = useState(themes[level]);
	// const [turns, setTurns] = useState(0);

	const [choiceOne, setChoiceOne] = useState(null);
	const [choiceTwo, setChoiceTwo] = useState(null);
	const [disabled, setDisabled] = useState(false);

	// shuffle cards for new game
	const shuffleCards = () => {
		const shuffledCards = [...cardImages, ...cardImages]
			.sort(() => Math.random() - 0.5)
			.map((card) => ({ ...card, id: Math.random() }));

		setChoiceOne(null);
		setChoiceTwo(null);
		setCards(shuffledCards);
		// setTurns(0);
	};

	// handle a choice
	const handleChoice = (card) => {
		choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
	};

	// compare 2 selected cards
	useEffect(() => {
		if (choiceOne && choiceTwo) {
			setDisabled(true);

			if (choiceOne.src === choiceTwo.src) {
				setCards((prevCards) => {
					return prevCards.map((card) => {
						if (card.src === choiceOne.src) {
							return { ...card, matched: true };
						} else {
							return card;
						}
					});
				});
				resetTurn();
			} else {
				setTimeout(() => resetTurn(), 500);
			}
		}
	}, [choiceOne, choiceTwo]);

	// reset choices & increase turn
	const resetTurn = () => {
		setChoiceOne(null);
		setChoiceTwo(null);
		// setTurns((prevTurns) => prevTurns + 1);
		setDisabled(false);
	};

	const playNextLevel = () => {
		shuffleCards();
		const currentLevel = +localStorage.getItem("memoryverseLevel") || 0;
		const nextLevel = (currentLevel + 1) % themes.length;
		localStorage.setItem("memoryverseLevel", nextLevel);
		setLevel(nextLevel);
		setTheme(themes[nextLevel]);
	};
	// start new game automatically
	useEffect(() => {
		shuffleCards();
	}, []);

	return (
		<div className="App">
			<section className="left">
				<header>
					<h1>MemoryVerse</h1>
					<button onClick={shuffleCards}>New Game</button>
				</header>
				{/* <p>Turns: {turns}</p> */}

				<div className="themeContainer">
					{themes.map((_theme) => (
						<span
							className={
								theme.name === _theme.name ? "active themeCard" : "themeCard"
							}
							key={_theme.name}
							onClick={() => setTheme(_theme)}
						>
							<img src={"/img/" + _theme.name + "/1.jpg"} alt="" />
						</span>
					))}
				</div>
			</section>
			<section className="right">
				<main className="card-grid">
					{cards.map((card) => (
						<SingleCard
							key={card.id}
							card={card}
							theme={theme.name}
							handleChoice={handleChoice}
							flipped={card === choiceOne || card === choiceTwo || card.matched}
							disabled={disabled}
						/>
					))}
				</main>
				{cards.every((card) => card.matched) && (
					<section className="playAgainSection">
						<div className="playAgainDiv">
							<p>Well Played!!</p>
							<button onClick={playNextLevel}>Play Again</button>
						</div>
					</section>
				)}
			</section>
		</div>
	);
}

export default App;

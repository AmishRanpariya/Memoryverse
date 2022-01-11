import { useState, useEffect } from "react";
import SingleCard from "./components/SingleCard";

const LOCAL_KEY = "memoryverseLevelForStudents";

const cardImages = [
	{ src: "/1.jpg", matched: false },
	{ src: "/2.jpg", matched: false },
	{ src: "/3.jpg", matched: false },
	{ src: "/4.jpg", matched: false },
	{ src: "/5.jpg", matched: false },
	{ src: "/6.jpg", matched: false },
];

const themes = [
	{ name: "numbers", bgColor: "#0F1C25" },
	{ name: "letters", bgColor: "#0F1C25" },
	{ name: "shapes", bgColor: "#0F1C25" },
	// { name: "fastfood", bgColor: "#3c56ad" },
	// { name: "diamond", bgColor: "#0d1c26" },
	{ name: "tree", bgColor: "#3a834f" },
	// { name: "kingdom", bgColor: "#242329" },
	// // { name: "war", bgColor: "#" },
	// { name: "witchcraft", bgColor: "#520c7e" },
	// { name: "war2", bgColor: "#261f1c" },
	// // { name: "blob", bgColor: "#" },
	// { name: "desert", bgColor: "#3a2f31" },
	{ name: "fruit", bgColor: "#5d5d5d" },
	{ name: "objects", bgColor: "#061428" },
	// { name: "ocean2", bgColor: "#332f2e" },
	// // { name: "pets", bgColor: "#" },
	// { name: "rings", bgColor: "#473a4c" },
	// { name: "ocean", bgColor: "#352f33" },
];
function sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	this.sound.volume = 0.5;
	document.body.appendChild(this.sound);
	this.play = function () {
		this.sound.play();
	};
	this.stop = function () {
		this.sound.pause();
	};
}
let winSound = new sound("/music/win.wav");
let tapSound = new sound("/music/tap.wav");
let matchSound = new sound("/music/match.wav");

function App() {
	const [cards, setCards] = useState([]);
	const [level, setLevel] = useState(localStorage.getItem(LOCAL_KEY) || 0);
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
		tapSound.play();
		choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
	};

	// compare 2 selected cards
	useEffect(() => {
		if (choiceOne && choiceTwo) {
			setDisabled(true);

			if (choiceOne.src === choiceTwo.src) {
				matchSound.play();
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
		const currentLevel = +localStorage.getItem(LOCAL_KEY) || 0;
		const nextLevel = (currentLevel + 1) % themes.length;
		localStorage.setItem(LOCAL_KEY, nextLevel);
		setLevel(nextLevel);
		setTheme(themes[nextLevel]);
	};
	// start new game automatically
	useEffect(() => {
		shuffleCards();
	}, []);

	useEffect(() => {
		document.body.style.backgroundColor = theme.bgColor;
	}, [theme]);

	useEffect(() => {
		if (cards.length > 0 && cards.every((card) => card.matched)) {
			winSound.play();
		}
	}, [cards]);

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

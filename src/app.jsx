import { useState, useEffect, useRef } from "react"
import { languages } from "./languages"
import Language from "./components/language"
import { getFarewellText } from "./utils"
import { getRandomWord } from "./utils"
import { clsx } from "clsx"
import { useWindowSize } from 'react-use'
import Confetti from 'react-confetti'


const App = () => {
  const newGameBtnRef = useRef(null)

  // for confetti
  const { width, height } = useWindowSize();

  // state values
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([])

  // derived value
  const numGuessesLeft = languages.length - 1
  const wrongGuessCount = guessedLetters.filter(letter => !currentWord.includes(letter)).length;
  const isGameWon = currentWord.split("").every(letter => guessedLetters.includes(letter))
  const isGameLost = wrongGuessCount >= numGuessesLeft
  const isGameOver = isGameWon || isGameLost
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1]
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter)

  // static value
  const alphabet = "abcdefghijklmnopqrstuvwxyz"

  useEffect(() => {
    if (isGameOver) {
      newGameBtnRef.current.focus()
    }
  }, [isGameOver])

  function addGuessedLetter(letter) {
    setGuessedLetters(prevletters =>
      prevletters.includes(letter) ? prevletters : [...prevletters, letter]
    )
  }

  function startNewGame() {
    setCurrentWord(getRandomWord())
    setGuessedLetters([])
  }

  const languagesList = languages.map((language, index) => {
    const isLanguageLost = index < wrongGuessCount
    return (
      <Language
        key={language.name}
        name={language.name}
        bgColor={language.backgroundColor}
        color={language.color}
        isLanguageLost={isLanguageLost}
      />
    )
  })

  const letterElements = currentWord.split("").map((letter, index) => {
    const isGuessed = guessedLetters.includes(letter)
    const shouldRevealLetter = isGameLost || isGuessed
    const letterClassName = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    )
    return (
      <span key={index} className={letterClassName}>
        {shouldRevealLetter ? letter.toUpperCase() : null}
      </span>
    )
  })

  const keyboardElements = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter)
    const isCorrect = isGuessed && currentWord.includes(letter)
    const isWrong = isGuessed && !currentWord.includes(letter)
    const className = clsx({
      correct: isCorrect,
      wrong: isWrong
    })

    return (
      <button
        className={className}
        key={letter}
        disabled={isGameOver}
        aria-disabled={guessedLetters.includes(letter)}
        aria-label={`letter ${letter}`}
        onClick={() => addGuessedLetter(letter)}>
        {letter.toUpperCase()}
      </button>
    )
  })

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  })

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return (
        <p className="farewell-message">{getFarewellText(languages[wrongGuessCount - 1].name)}</p>
      )
    }
    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      )
    }
    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly language</p>
        </>
      )
    }

    return null
  }

  return (
    <main>
      {isGameWon && <Confetti
        width={width}
        height={height}
      />}
      <div className="section-header">
        <h1>Assembly: Endgame</h1>
        <p>Guess the word within 8 attempts to keep the programming
          world safe from Assembly!
        </p>
      </div>
      <section aria-live="polite" role="status" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <div className="language-list">
        {languagesList}
      </div>
      <div className="word">
        {letterElements}
      </div>
      <div className="sr-only" aria-live="polite" role="status">
        <p>
          {currentWord.includes(lastGuessedLetter) ? `correct! The letter ${lastGuessedLetter} is in the word`
            : `Sorry, the letter ${lastGuessedLetter} is not in the word`}
          you have {numGuessesLeft} attempts left.
        </p>
        <p>Current word: {currentWord.split("").map(letter =>
          guessedLetters.includes(letter) ? letter + "." : "blank")
          .join("")
        }</p>
      </div>
      <div className="keyboard">
        {keyboardElements}
      </div>
      <div className="new-game">
        {isGameOver && <button ref={newGameBtnRef} onClick={startNewGame}>New Game</button>}
      </div>
    </main>
  )
}

export default App
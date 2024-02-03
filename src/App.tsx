import React, { useState, useEffect } from "react";

import "./App.css";

interface Character {
  id: number;
  name: string;
  height: number;
  mass: number;
  gender: string;
  homeworld: string;
  wiki: string;
  image: string;
  born: number;
  bornLocation: string;
  died: number;
  diedLocation: string;
  species: string;
  hairColor: string;
  eyeColor: string;
  skinColor: string;
  cybernetics: string;
  affiliations: string[];
  masters: string[];
  apprentices: string[];
  formerAffiliations: string[];
}

function App() {
  const [items, setItems] = useState<Character[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);

  const getRandomItems = (arr: any[], n: number) => {
    let result = new Array(n),
      len = arr.length,
      taken = new Array(len);
    if (n > len)
      throw new RangeError("getRandom: more elements taken than available");
    while (n--) {
      let x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  };

  useEffect(() => {
    fetch("https://akabab.github.io/starwars-api/api/all.json")
      .then((response: Response) => response.json())
      .then((data: Character[]) => {
        let items = getRandomItems(data, 8);
        items = [...items, ...items]; // duplicate items

        // Fisher-Yates (Knuth) Shuffle algorithm
        let currentIndex = items.length,
          temporaryValue,
          randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          // And swap it with the current element.
          temporaryValue = items[currentIndex];
          items[currentIndex] = items[randomIndex];
          items[randomIndex] = temporaryValue;
        }

        setItems(items);
      })
      .catch((error: Error) => console.error("Error:", error));
  }, []);

  const handleClick = (index: number) => {
    // Ignore clicks if two cards are already flipped or if clicked on already flipped cards
    if (flipped.length >= 2 || flipped.includes(index)) return;

    setFlipped((flipped) => [...flipped, index]);
  };

  const resetGame = () => {
    setFlipped([]);
    setMatched([]);
    // Shuffle the items array here if necessary
  };

  useEffect(() => {
    if (flipped.length === 2) {
      const firstCard = items[flipped[0]];
      const secondCard = items[flipped[1]];

      if (firstCard.id === secondCard.id) {
        setMatched((matched) => [...matched, firstCard.id]);
      }

      if (flipped.length === 2) setTimeout(() => setFlipped([]), 1000);
    }
  }, [flipped, items]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Star wars memory game</h1>
      </header>

      {matched.length === 8 ? (
        <div>
          <h2>🎉🎊 You've won! 🎊🎉</h2>
          <button onClick={resetGame}>Play Again</button>
        </div>
      ) : (
        <div className="app-grid">
          {items.map((item: Character, index: number) => (
            <div
              className={`card ${flipped.includes(index) ? "flipped" : ""} ${
                matched.includes(item.id) ? "removed flipped" : ""
              }`}
              key={index}
              onClick={() => handleClick(index)}
            >
              <div className="card-content">
                <div className="card-content-front"></div>
                <div className="card-content-back">
                  <img className="image" src={item.image} alt={item.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;

import * as React from 'react';
import classnames from 'classnames';
import './App.css';

const highlights = [];

function App() {
  const [round, setRound] = React.useState(0);
  const [highlightedIdx, setHighlightedIdx] = React.useState(null);

  const launchRound = React.useCallback(async () => {
    for (let highlight of highlights) {
      setHighlightedIdx(highlight);
      await sleep(500);
    }
    setHighlightedIdx(null);
  }, []);

  const nextRound = React.useCallback(() => {
    setRound((curRound) => curRound + 1);
    highlights.push(Math.round(Math.random() * 16));
    launchRound();
  }, [launchRound]);

  console.log(highlightedIdx);

  const cards = new Array(16)
    .fill(0)
    .map((_, idx) => <Card key={idx} isHighlighted={idx === highlightedIdx} />);

  return (
    <div className="app">
      <div>{round ? `Runde ${round}` : 'Druck den Knopf um anzufangen'}</div>
      <div className="board py-3">{cards}</div>
      <button type="button" className="btn btn-light" onClick={nextRound}>
        Ich bin bereit!
      </button>
    </div>
  );
}

function Card({ isHighlighted }) {
  return <div className={classnames('card', { '-highlighted': isHighlighted })} />;
}

async function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

export default App;

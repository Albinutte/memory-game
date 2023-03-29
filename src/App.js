import * as React from 'react';
import classnames from 'classnames';
import './App.css';

const TILES_COUNT = 16;

let highlights = [];
let correctlySelected = 0;

const State = {
  Initial: 'initial',
  Highlighting: 'highlighting',
  WaitingInput: 'waitingInput',
  RoundCompleted: 'roundCompleted',
  Failed: 'failed',
};

function App() {
  const [round, setRound] = React.useState(0);
  const [highlightedIdx, setHighlightedIdx] = React.useState(null);
  const [state, setState] = React.useState(State.Initial);

  const launchRound = React.useCallback(async () => {
    setState(State.Highlighting);
    for (let highlight of highlights) {
      await sleep(200);
      setHighlightedIdx(highlight);
      await sleep(800);
      setHighlightedIdx(null);
    }
    correctlySelected = 0;
    setState(State.WaitingInput);
  }, []);

  const nextRound = React.useCallback(() => {
    setRound((curRound) => curRound + 1);
    highlights.push();
    launchRound(getNextHighlight());
  }, [launchRound]);

  const clickCard = React.useCallback(
    (cardIdx) => {
      if (state !== State.WaitingInput) {
        return;
      }
      const expectedClick = highlights[correctlySelected];
      if (expectedClick !== cardIdx) {
        setState(State.Failed);
      } else {
        correctlySelected++;
        if (correctlySelected === highlights.length) {
          setState(State.RoundCompleted);
        }
      }
    },
    [state]
  );

  const startOver = React.useCallback(() => {
    highlights = [];
    correctlySelected = 0;
    setRound(0);
    nextRound();
  }, [nextRound]);

  const cards = new Array(TILES_COUNT)
    .fill(0)
    .map((_, idx) => (
      <Card
        key={idx}
        isHighlighted={idx === highlightedIdx}
        pendingInput={state === State.WaitingInput}
        onClick={() => clickCard(idx)}
        didFail={state === State.Failed}
      />
    ));

  return (
    <div className="app">
      <Header round={round} state={state} />
      <div className="board py-3">{cards}</div>
      <div className="footer">
        {state === State.Initial ? (
          <button type="button" className="btn btn-light" onClick={nextRound}>
            Ich bin bereit!
          </button>
        ) : null}
        {state === State.Highlighting ? <div>Pass auf!</div> : null}
        {state === State.WaitingInput ? <div>Du bist dran!</div> : null}
        {state === State.RoundCompleted ? (
          <button type="button" className="btn btn-light" onClick={nextRound}>
            Nächste Runde
          </button>
        ) : null}
        {state === State.Failed ? (
          <button type="button" className="btn btn-light" onClick={startOver}>
            Noch ein Mal?
          </button>
        ) : null}
      </div>
      <Signature />
    </div>
  );
}

function Header({ round, state }) {
  if (state === State.Failed) {
    return <div>Christian und Lenny sind traurig 😭</div>;
  }
  return round ? `Runde ${round}` : 'Drück den Knopf um anzufangen';
}

function Card({ isHighlighted, pendingInput, didFail, onClick }) {
  return (
    <div
      className={classnames('card', {
        '-highlighted': isHighlighted,
        '-pending-input': pendingInput,
        '-failed': didFail,
      })}
      onClick={onClick}
    />
  );
}

function Signature() {
  return (
    <div className="signature">
      <div>Albina Ezus, 2023</div>
      <div>Für Christian und Lenny.</div>
    </div>
  );
}

async function sleep(timeout) {
  return new Promise((resolve) => setTimeout(resolve, timeout));
}

function getNextHighlight() {
  return Math.min(Math.round(Math.random() * TILES_COUNT), TILES_COUNT - 1);
}

export default App;

import { useState } from 'react';

const Button = ({ handleClick, text }) => (
  //Painikkeen pohja
  <button onClick={handleClick}>{text}</button>
);

const MarkedVote = ({ anecdote, text }) => (
  //has votes tekstin pohja
  <>
    <div>{anecdote}</div>
    <div>{text}</div>
  </>
);

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(
    new Array(anecdotes.length + 1).join('0').split('').map(parseFloat)
  );

  const [index, setIndex] = useState(0)
  const [mostVotes, setMostVotes] = useState(0)

  const vote = () => {
    const copy = votes;
    // kasvatetaan taulukon paikan selected arvoa yhdellä
    copy[selected] += 1;

    setVotes(copy);
    console.log('Votes: ' + votes);

    //etsitään anekdootin index jolla on eniten äänestyksiä
    //ja talletetaan se index muuttujaan
    const updatedIndex = votes.indexOf(Math.max.apply(null, votes))
    setIndex(updatedIndex)
    console.log("index: " + index);

    //talletetaan mostVotes muuttujaan eniten äänestetyimmän anekdootin äänet
    const updateMostVotes = Math.max.apply(null, votes)
    setMostVotes(updateMostVotes)
  };

  const randomAnecdote = () => {
    //talletetaan muuttujaan rng anekdoottien määrä taulukossa
    const rng = anecdotes.length - 1;
    //talletetaan muuttujaan updateSelected satunnainen numero nollan ja rng:n välillä,
    //joka ei ole sama kuin muuttujassa selected oleva numero
    const updateSelected = Math.round(Math.random() * rng);
    console.log('random number: ' + updateSelected);

    setSelected(updateSelected);
  };

  return (
    <div>
      <MarkedVote
        anecdote={anecdotes[selected]}
        text={'has ' + votes[selected] + ' votes'}
      />
      <div>
        <Button handleClick={vote} text="vote" />
        <Button handleClick={randomAnecdote} text="next anecdote" />
      </div>
      <h1>Anecdote with the most votes</h1>
      <MarkedVote
        anecdote={anecdotes[index]}
        text={'has ' + mostVotes + ' votes'}
      />
    </div>
  );
};

export default App;

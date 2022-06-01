import { useState } from 'react'

const App = () => {
  const getRandomAnecdote = (currentAnecdote) => {
    let nextAnecdote = Math.floor(Math.random() * anecdotes.length);
    while (currentAnecdote === nextAnecdote) {
      nextAnecdote = Math.floor(Math.random() * anecdotes.length);
    }
    return nextAnecdote;
  }
  const handleChangeAnecdote = (anecdoteIndex) => {
    setSelected(getRandomAnecdote(anecdoteIndex));
  }
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]
  const arrayOfVotes = Array(anecdotes.length);

  for (let index = 0; index < anecdotes.length; index++) {
    arrayOfVotes[index] = 0;
  }

  const [selected, setSelected] = useState(getRandomAnecdote(-1)); // gets new anecdote
  const [votes, setVotes] = useState(arrayOfVotes);
  const [mostVoted, setMostVoted] = useState(0);
  const handleVotesCount = (index) => {
    const votesArray = [...votes];
    votesArray.splice(index, 1, votesArray[index] + 1);
    const mostVoted = Math.max(...votesArray);
    setVotes(votesArray);
    setMostVoted(votesArray.indexOf(mostVoted));
  }
  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {votes[selected]} votes</p>
      <button onClick={() => handleVotesCount(selected)}>vote</button>
      <button onClick={() => handleChangeAnecdote(selected)}>next anecdote</button>
      {" "}
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[mostVoted]}</p>
      <p>has {votes[mostVoted]} votes</p>
    </div>
  )
}

export default App

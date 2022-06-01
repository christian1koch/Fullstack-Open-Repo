import { useState } from "react";
import "./App.css";
// helper function for the sum
const sumAllItems = (items) => {
  let sum = 0;
  for (let index = 0; index < items.length; index++) {
    sum += items[index];
  }
  return sum;
};
const StatisticLine = (props) => {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th scope="row">{props.text}</th>
            <td>{props.value}</td>
          </tr>
        </thead>
      </table>
    </div>
  );
};
const Button = (props) => {
  return (
    <div>
      <button onClick={props.handleClick}>{props.title}</button>
    </div>
  );
};

const Feedback = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>
      <Button
        handleClick={props.handleGoodFeedback}
        title={"good"}
      ></Button>
      <Button
        handleClick={props.handleNeutralFeedback}
        title={"neutral"}
      ></Button>
      <Button
        handleClick={props.handleBadFeedback}
        title={"bad"}
      ></Button>
    </div>
  );
};
const Statistics = (props) => {
  const feedbackSum = sumAllItems([props.good, props.neutral, props.bad]);
  if (feedbackSum !== 0) {
    return (
      <div>
        <h1>{props.title}</h1>
        <StatisticLine
          text="good"
          value={props.good}
        />
        <StatisticLine
          text="neutral"
          value={props.neutral}
        />
        <StatisticLine
          text="bad"
          value={props.bad}
        />
        <StatisticLine
          text="all"
          value={feedbackSum}
        />
        <StatisticLine
          text="average"
          value={(props.good - props.bad) / feedbackSum}
        />
        <StatisticLine
          text="positive"
          value={(props.good * 100) / feedbackSum}
        />
      </div>
    );
  }
  return (
    <div>
      <h1>{props.title}</h1>
      <p>No feedback given</p>
    </div>
  );
};
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <Feedback
        title={"Feedback"}
        handleGoodFeedback={() => setGood(good + 1)}
        handleNeutralFeedback={() => setNeutral(neutral + 1)}
        handleBadFeedback={() => setBad(bad + 1)}
      />
      <Statistics
        title={"Statistics"}
        good={good}
        neutral={neutral}
        bad={bad}
      />
    </div>
  );
};

export default App;

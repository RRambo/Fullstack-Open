import { useState } from 'react';

const Button = ({ handleClick, text }) => (
  //Painikkeen pohja
  <button onClick={handleClick}>{text}</button>
);

const StatisticLine = (props) => {
  //Pohja, tilaston riville
  return (
    <tr>
      <td>{props.text}</td>
      <td>
        {props.value} {props.text2}
      </td>
    </tr>
  );
};

const Statistics = (props) => {
  //Kaikki tilastos koottuna yhteen
  console.log(props)
  return (
    <tbody>
      <StatisticLine text="good" value={props.good} />
      <StatisticLine text="neutral" value={props.neutral} />
      <StatisticLine text="bad" value={props.bad} />
      <StatisticLine text="total" value={props.total} />
      <StatisticLine text="average" value={props.average} />
      <StatisticLine text="positive" value={props.positive} text2={' %'} />
    </tbody>
  );
};

const Feedback = (props) => {
  //Tarkistetaan onko tilastoja yhtään. Jos ei ole, annetaan teksti "No feedback given"
  if (props.total === 0) {
    return (
      <tbody>
        <tr>
          <td>No feedback given</td>
        </tr>
      </tbody>
    );
  }
  return (
    <Statistics
      good={props.good}
      neutral={props.neutral}
      bad={props.bad}
      total={props.total}
      average={props.average}
      positive={props.positive}
    />
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [positive, setPositive] = useState(0);

  //Painikkeiden toiminnot
  const handleGoodClick = () => {
    const updatedGood = good + 1;
    const updatedTotal = updatedGood + neutral + bad;
    const updatedAverage = (updatedGood - bad) / updatedTotal;
    const updatedPositive = (updatedGood / updatedTotal) * 100;

    setGood(updatedGood);

    setTotal(updatedTotal);

    setAverage(updatedAverage);

    setPositive(updatedPositive);
  };

  const handleNeutralClick = () => {
    const updatedNeutral = neutral + 1;
    const updatedTotal = good + updatedNeutral + bad;
    const updatedAverage = (good - bad) / updatedTotal;
    const updatedPositive = (good / updatedTotal) * 100;
    
    setNeutral(updatedNeutral);

    setTotal(updatedTotal);

    setAverage(updatedAverage);

    setPositive(updatedPositive);
  };

  const handleBadClick = () => {
    const updatedBad = bad + 1;
    const updatedTotal = good + neutral + updatedBad;
    const updatedAverage = (good - updatedBad) / updatedTotal;
    const updatedPositive = (good / updatedTotal) * 100;
    
    setBad(updatedBad);

    setTotal(updatedTotal);

    setAverage(updatedAverage);

    setPositive(updatedPositive);
  };

  return (
    //Sovelluksen UI (käyttöliittymä)
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleGoodClick} text="good" />
      <Button handleClick={handleNeutralClick} text="neutral" />
      <Button handleClick={handleBadClick} text="bad" />
      <h1>statistics</h1>
      <table>
        <Feedback
          good={good}
          neutral={neutral}
          bad={bad}
          total={total}
          average={average}
          positive={positive}
        />
      </table>
    </div>
  );
};

export default App;

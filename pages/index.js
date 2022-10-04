const DUMMY_DATA = [
  {
    id: 1,
    answer: "1st answer",
  },
  {
    id: 2,
    answer: "2nd answer",
  },
];

function HomePage() {
  return (
    <div>
      <h1>POC</h1>
      <div>
        <p>
          {DUMMY_DATA.map((answer) => (
            <li key={answer.id}>{answer.answer}</li>
          ))}
        </p>
      </div>
    </div>
  );
}

export default HomePage;

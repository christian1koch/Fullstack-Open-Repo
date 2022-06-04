const Header = ({ course }) => <h1>{course}</h1>;
const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => {
    return (sum += part.exercises);
  }, 0);
  return (
    <>
      <p>
        <strong>Total of {total} exercises</strong>
      </p>
    </>
  );
};

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part
        part={part}
        key={part.id}
      />
    ))}
  </>
);

const Course = ({ course }) => (
  <>
    <Header course={course.name} />
    <Content parts={course.parts} />
    <Total parts={course.parts} />
  </>
);
export default Course;

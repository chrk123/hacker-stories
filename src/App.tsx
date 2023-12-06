import * as React from "react";

interface Book {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}

const list: Book[] = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
];

interface welcome {
  greeting: string;
  title: string;
}

const welcomeStrings: welcome = { greeting: "Hey", title: "React" };

const App = () => (
  <div>
    <h1>
      {welcomeStrings.greeting} {welcomeStrings.title}
    </h1>
    <Search />

    <hr />

    <List />

    <hr />

    <List />
  </div>
);

const Search = () => {
  const logEvent = (event) => {
    console.log(event);
    console.log(event.target.value);
  };

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" onChange={logEvent}/>
    </div>
  );
};

const List = () => (
  <ul>
    {list.map((item) => (
      <li key={item.objectID}>
        <span>
          <a href={item.url}>{item.title}:</a>
        </span>
        <span>, {item.author}</span>
        <span>, {item.num_comments}</span>
        <span>, {item.points}</span>
      </li>
    ))}
  </ul>
);

export default App;

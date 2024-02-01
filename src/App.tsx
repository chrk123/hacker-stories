import * as React from "react";

interface Book {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
  objectID: number;
}
interface welcome {
  greeting: string;
  title: string;
}

const welcomeStrings: welcome = { greeting: "Hey", title: "React" };

/* eslint-disable  @typescript-eslint/no-explicit-any */
const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {
  const stories: Book[] = [
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

  console.log("App renders");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <>
      <h1>
        {welcomeStrings.greeting} {welcomeStrings.title}
      </h1>
      <InputWithLabel id="search" label="Search" value={searchTerm} onInputChange={handleSearch} />

      <hr />

      <List
        list={stories.filter((item: Book) =>
          item.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        )}
      />
    </>
  );
};

interface InputWithLabelProps {
  id: string,
  label: string,
  value: string,
  type?: string,
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputWithLabel = ({ id, label, type = "text", value, onInputChange }: InputWithLabelProps) => {
  console.log("Search renders");

  return (
    <>
      <label htmlFor={id}>{label}: </label>
      <input id={id} type={type} value={value} onChange={onInputChange} />
    </>
  );
};

interface ListProps {
  list: Book[];
}

const List = ({ list }: ListProps) => {
  console.log("List renders");
  return (
    <ul>
      {list.map(({ objectID, ...item }) => (
        <Item key={objectID} {...item} />
      ))}
    </ul>
  );
};

interface ItemProps {
  title: string;
  url: string;
  author: string;
  num_comments: number;
  points: number;
}

const Item = ({ title, url, author, num_comments, points }: ItemProps) => {
  console.log("Item renders");
  return (
    <li>
      <span>
        <a href={url}>{title}:</a>
      </span>
      <span>, {author}</span>
      <span>, {num_comments}</span>
      <span>, {points}</span>
    </li>
  );
};

export default App;

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

  const [searchTerm, setSearchTerm] = React.useState("");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>
        {welcomeStrings.greeting} {welcomeStrings.title}
      </h1>
      <Search onSearch={handleSearch} />

      <hr />

      <List
        list={stories.filter((item: Book) =>
          item.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
        )}
      />
    </div>
  );
};

interface SearchProps {
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = (props: SearchProps) => {
  console.log("Search renders");

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" onChange={props.onSearch} />
    </div>
  );
};

interface ListProps {
  list: Book[];
}

const List = (props: ListProps) => {
  console.log("List renders");
  return (
    <ul>
      {props.list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
};

interface ItemProps {
  item: Book;
}

const Item = (props: ItemProps) => {
  console.log("Item renders");
  return (
    <li>
      <span>
        <a href={props.item.url}>{props.item.title}:</a>
      </span>
      <span>, {props.item.author}</span>
      <span>, {props.item.num_comments}</span>
      <span>, {props.item.points}</span>
    </li>
  );
};

export default App;

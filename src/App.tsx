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

  const [searchTerm, setSearchTerm] = React.useState("React");

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div>
      <h1>
        {welcomeStrings.greeting} {welcomeStrings.title}
      </h1>
      <Search search={searchTerm} onSearch={handleSearch} />

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
  search: string;
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search = ({ search, onSearch }: SearchProps) => {
  console.log("Search renders");

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input id="search" type="text" value={search} onChange={onSearch} />
    </div>
  );
};

interface ListProps {
  list: Book[];
}

const List = ({ list }: ListProps) => {
  console.log("List renders");
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.objectID} item={item} />
      ))}
    </ul>
  );
};

interface ItemProps {
  item: Book;
}

const Item = ({ item }: ItemProps) => {
  console.log("Item renders");
  return (
    <li>
      <span>
        <a href={item.url}>{item.title}:</a>
      </span>
      <span>, {item.author}</span>
      <span>, {item.num_comments}</span>
      <span>, {item.points}</span>
    </li>
  );
};

export default App;

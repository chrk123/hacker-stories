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

  const [searchTerm, setSearchTerm] = React.useState(
    localStorage.getItem("search") || "React"
  );

  React.useEffect(() => {
    localStorage.setItem("search", searchTerm);
  }, [searchTerm]);

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

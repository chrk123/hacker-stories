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

const useStorageState = (key: string, initialState: string) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue] as const;
};

enum StoriesActionType {
  SetStories,
}

interface SetStoriesAction {
  type: StoriesActionType.SetStories;
  payload: Book[];
}

type StoriesAction = SetStoriesAction

const App = () => {
  const defaultStories: Book[] = [
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

  // passed function to promise constructor gets executed at construction
  // so at construction, we initiate the 2000ms timeout, which will resolved the promises after
  const getAsyncStories = () =>
    new Promise<{ data: { stories: Book[] } }>((resolve) =>
      setTimeout(() => resolve({ data: { stories: defaultStories } }), 2000)
    );

  console.log("App renders");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const storiesReducer = (state : Book[], action : StoriesAction): Book[] => {
    if (action.type === StoriesActionType.SetStories) {
      return action.payload;
    }

    return state;
  }

  const [stories, dispatchStories] = React.useReducer(storiesReducer, []);

  const [booksLoading, setBooksLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setBooksLoading(true);
    getAsyncStories()
      .then((result) => {
        dispatchStories({
          type: StoriesActionType.SetStories,
          payload: result.data.stories}
          );
        setBooksLoading(false);
      })
      .catch(() => setHasError(true));
  }, []);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const deleteBook = (objectID: number) =>
    dispatchStories(
      {type: StoriesActionType.SetStories,
       payload: stories.filter((item: Book) => item.objectID != objectID)
      });

  return (
    <>
      <h1>
        {welcomeStrings.greeting} {welcomeStrings.title}
      </h1>
      <RadioSelection id="radio" options={["a", "b"]} />
      <br />
      <br />
      <InputWithLabel
        id="search"
        value={searchTerm}
        isFocused={true}
        onInputChange={handleSearch}
      >
        <strong>Search: </strong>
      </InputWithLabel>

      <hr />

      {hasError && <p>Error, something went wrong</p>}
      {booksLoading ? (
        <LoadingScreen />
      ) : (
        <List
          list={stories.filter((item: Book) =>
            item.title.toLowerCase().includes(searchTerm.toLocaleLowerCase())
          )}
          itemActionLabel="Delete"
          onItemAction={deleteBook}
        />
      )}
    </>
  );
};

interface InputWithLabelProps {
  id: string;
  value: string;
  type?: string;
  isFocused?: boolean;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children: React.ReactNode;
}

const InputWithLabel = ({
  id,
  type = "text",
  value,
  isFocused = false,
  onInputChange,
  children,
}: InputWithLabelProps) => {
  console.log("Search renders");

  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isFocused && inputRef.current) {
      // D
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      <input
        id={id}
        ref={inputRef}
        type={type}
        value={value}
        onChange={onInputChange}
      />
    </>
  );
};

interface ListProps {
  list: Book[];
  itemActionLabel: string;
  onItemAction: (objectID: number) => void;
}

const List = ({ list, itemActionLabel, onItemAction }: ListProps) => {
  console.log("List renders");

  return (
    <ul>
      {list.map(({ objectID, ...item }) => (
        <div className="item_grid">
          <Item key={objectID} {...item} />
          <Button
            label={itemActionLabel}
            onClickHandler={() => {
              onItemAction(objectID);
            }}
          />
        </div>
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

interface RadioExclusiveSelectionProps {
  id: string;
  options: string[];
}

const RadioSelection = ({ id, options }: RadioExclusiveSelectionProps) => {
  return (
    <>
      {options.map((option: string, idx: number) => {
        const index = `${id}_${idx}`;

        return (
          <>
            <input
              type="radio"
              id={index}
              name={`${id}_radiogroup`}
              value={option}
            />
            <label htmlFor={index}>{option}</label>
          </>
        );
      })}
    </>
  );
};

interface ButtonProps {
  label: string;
  onClickHandler: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ label, onClickHandler }: ButtonProps) => (
  <button onClick={onClickHandler}>{label}</button>
);

const LoadingScreen = () => <p>Loading ...</p>;

export default App;

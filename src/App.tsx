import * as React from "react";
import axios from "axios";
import styles from "./App.module.css";
import clsx from "clsx";
import Check from "./check.svg?react";

export interface Book {
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

export enum StoriesActionType {
  SetStories,
  DeleteStory,
  StartFetching,
  ReportError,
}

export interface SetStoriesAction {
  type: StoriesActionType.SetStories;
  payload: Book[];
}

export interface DeleteStoryAction {
  type: StoriesActionType.DeleteStory;
  payload: number;
}

export interface StartFetchingAction {
  type: StoriesActionType.StartFetching;
}

export interface ReportErrorAction {
  type: StoriesActionType.ReportError;
  payload: string;
}

export interface BookState {
  books: Book[];
  isLoading: boolean;
  hasError: boolean;
}

export type StoriesAction =
  | SetStoriesAction
  | DeleteStoryAction
  | StartFetchingAction
  | ReportErrorAction;

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

type SortType = "None" | "Author";

const asSortType: (str: string) => SortType = (str) => {
  if (str === "Author") return "Author";

  return "None";
};

const sortStories = (books: Book[], sortType: SortType) => {
  const lexicographicComparison = (lhs: string, rhs: string) => {
    if (lhs === rhs) return 0;

    return lhs < rhs ? -1 : +1;
  };

  if (sortType === "Author")
    return books.sort((lhs, rhs) => {
      return lexicographicComparison(lhs.author, rhs.author);
    });

  return books;
};

const storiesReducer = (state: BookState, action: StoriesAction): BookState => {
  switch (action.type) {
    case StoriesActionType.StartFetching:
      return { ...state, books: [], isLoading: true, hasError: false };
    case StoriesActionType.ReportError:
      return { ...state, books: [], isLoading: false, hasError: true };
    case StoriesActionType.SetStories:
      return {
        ...state,
        books: action.payload,
        isLoading: false,
        hasError: false,
      };
    case StoriesActionType.DeleteStory:
      return {
        ...state,
        books: state.books.filter(
          (item: Book) => item.objectID !== action.payload
        ),
        isLoading: false,
        hasError: false,
      };
  }
};

const App = () => {
  console.log("App renders");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    books: [],
    isLoading: true,
    hasError: false,
  });

  const [sorting, setSorting] = React.useState<SortType>("None");

  const [searchUrl, setSearchUrl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const querySearch = (event: React.SyntheticEvent<HTMLFormElement>) => {
    setSearchUrl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  const handleFetchStories = React.useCallback(async () => {
    if (!searchTerm) {
      dispatchStories({ type: StoriesActionType.SetStories, payload: [] });
      return;
    }

    dispatchStories({
      type: StoriesActionType.StartFetching,
    });

    try {
      const result = await axios.get(searchUrl);

      dispatchStories({
        type: StoriesActionType.SetStories,
        payload: result.data.hits,
      });
    } catch {
      dispatchStories({
        type: StoriesActionType.ReportError,
        payload: "error",
      });
    }
  }, [searchUrl]);

  React.useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const deleteBook = (objectID: number) =>
    dispatchStories({ type: StoriesActionType.DeleteStory, payload: objectID });

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>
        {welcomeStrings.greeting} {welcomeStrings.title}
      </h1>
      <RadioSelection
        id="radio"
        options={["Author", "None"]}
        onChange={(option) => {
          setSorting(asSortType(option));
        }}
      />
      <br />
      <br />
      <SearchForm
        searchTerm={searchTerm}
        onInputChanged={handleSearch}
        onSubmit={querySearch}
      />

      {stories.hasError && <p>Error, something went wrong</p>}
      {stories.isLoading ? (
        <LoadingScreen />
      ) : (
        <List
          list={sortStories(stories.books, sorting)}
          itemActionLabel="Delete"
          onItemAction={deleteBook}
        />
      )}
    </div>
  );
};

interface SearchFormProps {
  searchTerm: string;
  onInputChanged: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: React.SyntheticEvent<HTMLFormElement>) => void;
}

const SearchForm = ({
  searchTerm,
  onInputChanged,
  onSubmit,
}: SearchFormProps) => (
  <form onSubmit={onSubmit} className={styles.searchForm}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused={true}
      onInputChange={onInputChanged}
    >
      <strong>Search: </strong>
    </InputWithLabel>
    <Button
      styleClass="large"
      type={"submit"}
      disabled={!searchTerm}
      label={"Go!"}
    />
  </form>
);

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
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label className={styles.label} htmlFor={id}>
        {children}
      </label>
      <input
        className={styles.input}
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
            styleClass="small"
            label={itemActionLabel}
            onClickHandler={() => {
              onItemAction(objectID);
            }}
          >
            <Check width="18px" height="18px" />
          </Button>
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
    <li className={styles.item}>
      <span style={{ width: "40%" }}>
        <a href={url}>{title}:</a>
      </span>
      <span style={{ width: "30%" }}>{author}</span>
      <span style={{ width: "10%" }}>{num_comments}</span>
      <span style={{ width: "10%" }}>{points}</span>
    </li>
  );
};

interface RadioExclusiveSelectionProps {
  id: string;
  options: string[];
  onChange: (option: string) => void;
}

const RadioSelection = ({
  id,
  options,
  onChange,
}: RadioExclusiveSelectionProps) => {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
    return onChange(e.target.value);
  };

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
              onChange={changeHandler}
            />
            <label htmlFor={index}>{option}</label>
          </>
        );
      })}
    </>
  );
};

interface ButtonProps {
  styleClass: "large" | "small";
  label: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({
  styleClass,
  label,
  type,
  disabled,
  onClickHandler,
  children,
}: React.PropsWithChildren<ButtonProps>) => (
  <button
    className={clsx(
      styles.button,
      styleClass === "large" ? styles.button_large : styles.button_small
    )}
    type={type}
    disabled={disabled}
    onClick={onClickHandler}
  >
    {children ? children : label}
  </button>
);

const LoadingScreen = () => <p>Loading ...</p>;

export default App;
export { storiesReducer, SearchForm, InputWithLabel, List, Item };

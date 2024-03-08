import * as React from "react";
import axios from "axios";

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
  DeleteStory,
  StartFetching,
  ReportError,
}

interface SetStoriesAction {
  type: StoriesActionType.SetStories;
  payload: Book[];
}

interface DeleteStoryAction {
  type: StoriesActionType.DeleteStory;
  payload: number;
}

interface StartFetchingAction {
  type: StoriesActionType.StartFetching;
}

interface ReportErrorAction {
  type: StoriesActionType.ReportError;
  payload: string;
}

interface BookState {
  books: Book[];
  isLoading: boolean;
  hasError: boolean;
}

type StoriesAction =
  | SetStoriesAction
  | DeleteStoryAction
  | StartFetchingAction
  | ReportErrorAction;

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";

const App = () => {
  console.log("App renders");

  const [searchTerm, setSearchTerm] = useStorageState("search", "React");

  const storiesReducer = (
    state: BookState,
    action: StoriesAction
  ): BookState => {
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

  const [stories, dispatchStories] = React.useReducer(storiesReducer, {
    books: [],
    isLoading: true,
    hasError: false,
  });

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
    <>
      <h1>
        {welcomeStrings.greeting} {welcomeStrings.title}
      </h1>
      <RadioSelection id="radio" options={["a", "b"]} />
      <br />
      <br />
      <SearchForm
        searchTerm={searchTerm}
        onInputChanged={handleSearch}
        onSubmit={querySearch}
      />
      <hr />

      {stories.hasError && <p>Error, something went wrong</p>}
      {stories.isLoading ? (
        <LoadingScreen />
      ) : (
        <List
          list={stories.books}
          itemActionLabel="Delete"
          onItemAction={deleteBook}
        />
      )}
    </>
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
  <form onSubmit={onSubmit}>
    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused={true}
      onInputChange={onInputChanged}
    >
      <strong>Search: </strong>
    </InputWithLabel>
    <Button type={"submit"} disabled={!searchTerm} label={"Go!"} />
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
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClickHandler?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const Button = ({ label, type, disabled, onClickHandler }: ButtonProps) => (
  <button type={type} disabled={disabled} onClick={onClickHandler}>
    {label}
  </button>
);

const LoadingScreen = () => <p>Loading ...</p>;

export default App;

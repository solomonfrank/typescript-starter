import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";
import { Provider } from "react-redux";
import { useAppDispatch, useAppSelector } from "./hooks";
import { store } from "./redux/state/store";
import {
  searchRepositoriesError,
  searchRepositoriesSuccess,
  searchRepository,
} from "./redux/state/reducers/repositories";
import "./index.css";

import CodeCell from "./component/CodeCell";
import MarkDownEditor from "./component/TextEditor";

const App = () => {
  const [phrase, setPhrase] = useState("");
  // const repos = useAppSelector((state) => state.repositories);

  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhrase(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchRepos(phrase);
  };
  const fetchRepos = async (phrase: string) => {
    try {
      dispatch(searchRepository());
      const { data } = await axios.get(
        "https://registry.npmjs.org/-/v1/search",
        {
          params: {
            text: phrase,
          },
        }
      );

      const names = data.objects.map((item: any) => {
        return item.package.name;
      });

      dispatch(searchRepositoriesSuccess(names));
    } catch (ex) {
      if (ex instanceof Error) {
        dispatch(searchRepositoriesError(ex.message));
      }
    }
  };

  return (
    <div className="input-wrapper">
      <MarkDownEditor />
      {/* <CodeCell /> */}
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.querySelector("#root") as HTMLElement
);

// const root = ReactDOM.createRoot
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

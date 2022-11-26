import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

// Define a type for the slice state
interface IReducerState {
  loading: boolean;
  error: string | null;
  data: string[];
}

// Define the initial state using that type
const initialState: IReducerState = {
  loading: false,
  error: null,
  data: [],
};

export const repositoriesSlice = createSlice({
  name: "Repo",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    searchRepository: (state) => {
      state.loading = true;
    },
    searchRepositoriesSuccess: (state, action: PayloadAction<string[]>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    searchRepositoriesError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.loading = false;
      state.data = [];
    },
  },
});

export const {
  searchRepositoriesError,
  searchRepositoriesSuccess,
  searchRepository,
} = repositoriesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCount = (state: RootState) => state;

export default repositoriesSlice.reducer;

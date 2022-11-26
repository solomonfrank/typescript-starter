import { eActionType } from "../action-types";

export interface ISearchRepositoryAction {
  type: eActionType.SEARCH_REPOSITORIES;
}

export interface ISearchRepositorySuccessAction {
  type: eActionType.SEARCH_REPOSITORIES_SUCCESS;
  payload: string[];
}

export interface ISearchRepositoryErrorAction {
  type: eActionType.SEARCH_REPOSITORIES_ERROR;
  payload: string;
}

export type ActionTypes =
  | ISearchRepositoryAction
  | ISearchRepositorySuccessAction
  | ISearchRepositoryErrorAction;

import { Message, MessageType, Peer } from ".";

export interface IAppLoadAction {
  type: "APP_LOAD";
}

export function appLoad(): IAppLoadAction {
  return {
    type: "APP_LOAD"
  };
}

export type IActions = IAppLoadAction;

export interface IPeerMetaSentAction {
  type: "peer/META_SENT";
}

export function metaSent(): IPeerMetaSentAction {
  return {
    type: "peer/META_SENT"
  };
}

export type IActions = IPeerMetaSentAction;

export type Response = {
  method: string;
  path: string;
  body: {
    source: string;
    type: string;
    payload: {
      instanceName: string;
      host: string;
    };
    timestamp: string;
  };
};

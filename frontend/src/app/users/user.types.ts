export type User = {
  _id: string;
  fullname: string;
  email: string;
  password: string;
};

export interface State {
  _id: string;
  fullname: string;
  email: string;
  jwt: string;
}

export const initialState = {
  _id: '',
  fullname: 'Guest',
  email: '',
  jwt: '',
};

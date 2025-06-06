export interface SignupData {
  username: string;
  password: string;
}

export interface SignupResponse {
  message: string;
  token: string;
  user: {
    id: string;
    username: string;
  };
} 
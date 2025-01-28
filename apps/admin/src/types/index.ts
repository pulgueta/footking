export type SoccerField = {
  id: string;
  name: string;
  address: string;
  state: string;
  availability?: {
    [day: string]: {
      isAvailable: boolean;
      hours: string;
    };
  };
};

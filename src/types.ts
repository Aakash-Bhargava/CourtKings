export interface Challenge {
  id: string;
  coinsBet: number;
  court: Court;
  gameTime: string;
  status: string;
  date: any;
  teams: Array<Team>;
  winners: Team;
}

export interface User {
  coins: number;
  courtsRuled: number;
  email: string;
  id: string;
  lossTotal: number;
  name: string;
  profilePic: string;
  streetName: string;
  teams: Array<Team>;
  winTotal: number;
}

export interface Team {
  id: string;
  homeTown: string;
  losses: number;
  players: Array<User>;
  teamImage: string;
  wins: number;
  teamName: string;
}

export interface TeamDetail extends Team {
  challenges: Array<Challenge>;
  challengesWon: Array<Challenge>;
  courtsRuled: Array<Court>;
  playAt: Array<Court>;
}

export interface Court {
  id: string;
  courtName: string;
  latitude: number;
  longitude: number;
  challenges: Array<Challenge>;
}

export interface CourtDetail extends Court {
  courtKings: Team;
  standings: Array<Team>;
}

export type Schedule = {
  hour: string,
  teams: Array<string>,
};

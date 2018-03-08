export interface Challenge {
  id: string;
  coinsBet: number;
  court: Court;
  gameTime: string;
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
  playAt?: Array<Court>;
}

export interface Court {
  id: string;
  courtName: string;
  latitude: number;
  longitude: number;
}

export interface CourtDetail extends Court {
  challenges: Array<Challenge>;
  courtKings: Team;
  standings: Array<Team>;
}

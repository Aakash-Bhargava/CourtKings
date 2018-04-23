export interface Challenge {
  id: string;
  coinsBet: number;
  court: Court;
  gameTime: string;
  status: string;
  date: any;
  teams: Array<Team>;
  winners: Team;
  votes: Array<Vote>;
}

export interface User {
  email: string;
  id: string;
  name: string;
  profilePic: string;
  streetName: string;
  coins: number;
  teams: Array<Team>;
}

export interface UserDetail extends User {
  teams: Array<TeamDetail>;
  notifications: Array<Notification>;
}

export interface Team {
  id: string;
  homeTown: string;
  players: Array<User>;
  teamImage: string;
  teamName: string;
  challengesWon: Array<Challenge>;
  captain: User;
}

export interface Vote {
  voteFor: Team;
  voteFrom: Team;
}

export interface TeamDetail extends Team {
  challenges: Array<Challenge>;
  courtsRuled: Array<Court>;
  playAt: Array<Court>;
  notifications: Array<Notification>;
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
}

export type Schedule = {
  hour: string,
  teams: Array<string>,
};

export type Notification = {
  type: 'NewTeam' | 'Schedule',
  challenge: Challenge,
  createdAt: string,
};

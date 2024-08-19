import { Guess, TileCount } from "@/app/components/GameBoard/GameBoard"
import { DailyInfo } from "@/lib/redis";

/* Generic types used in Message Types below */
type UserName = string;
type Code = string;

export type MultiplayerUser = {
  guessInfo: [Guess, TileCount]
  points: number,
}

export type MultiplayerGame = {
  [users: UserName]: MultiplayerUser

}
export type MultiplayerData = {
  [games: Code]: MultiplayerGame
}

// List of countries previously selected for rounds in the game and round number
export type MultiplayerBookkeeping = {
    [games: Code]: {
        previouslySelected: string[];
        roundNumber: number;
    }
}

type EmptyString = "";

export type RoundInfoData = {
    countryInfo : DailyInfo,
    roundNumber : number
}

/* Message Body Types (See socket-messages for the message titles) */
export type PLAYERS_BODY = MultiplayerGame;
export type START_REQUEST_BODY = Code;
export type START_BODY = EmptyString;
export type ROUND_INFO_BODY = RoundInfoData;
export type ROUND_START_BODY = EmptyString;
export type ROUND_END_BODY = EmptyString;
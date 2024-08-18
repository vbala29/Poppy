import { Guess, TileCount } from "@/app/components/GameBoard/GameBoard"

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

export type PLAYERS_BODY = MultiplayerGame;
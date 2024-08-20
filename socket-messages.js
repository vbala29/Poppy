/* Message Titles */
export const PLAYERS = "PLAYERS"; 
export const START_REQUEST = "START_REQUEST"; 
export const START = "START";
export const ROUND_INFO = "ROUND_INFO";
export const ROUND_START = "ROUND_START";
export const ROUND_END = "ROUND_END";
export const GUESS = "GUESS"; // Includes message with the guess a user has made yet.
export const SCORE_INFO = "SCORE_INFO";
export const PLAYERS_UPDATE = "PLAYERS_UPDATE"; 
export const ROUND_INTERLUDE = "ROUND_INTERLUDE"
export const GUESS_MADE = "GUESS_MADE"; // Is for the pop ups about user made guesses (client -> sever).
export const GUESS_UPDATE = "GUESS_UPDATE"; // The forwarded GUESS_MADE message to everyone in the game (server -> client).

/* MISC */
export const ROUND_DELAY = 5000; // Wait 5 seconds between round information sent and round start.
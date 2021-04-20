export interface InFileLayout {
    player1 : {
        deck : string[]
        strategy : string
    }

    player2 : {
        deck : string[]
        strategy : string
    }

    game: number
    numberOfGames: number
}
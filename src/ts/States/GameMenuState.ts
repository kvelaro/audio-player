import Game from "../Game";
import GameState from "./GameState";
import {GameLevels} from "../Levels/GameLevels";
import GamePlayingState from "./GamePlayingState";


export default class GameMenuState extends GameState {
    constructor(game: Game) {
        super(game)
    }

    enter(prevState: GameState) {
        super.enter(prevState)
        this.background()
    }

    handleInput(event: KeyboardEvent): void {
        if(event.code == 'Space' && event.type == 'keydown') {
            this.game.setState(new GamePlayingState(this.game, new (<any>GameLevels)['Level1']()))
        }
    }

    run() {
        super.run()
        let objects = this.objects
        for (let i = 0; i < objects.length; i++) {
            if(objects[i] && objects[i].delete) {
                objects.splice(i, 1)
                continue
            }
            objects[i].draw()
            objects[i].update()
        }

        this.game.context().save()
        this.game.context().fillStyle = "#000"
        this.game.context().font = "50px Arial"
        this.game.context().textAlign = 'center'
        this.game.context().fillText('PRESS SPACE TO START GAME', this.game.w() / 2, this.game.h() / 2)
        this.game.context().restore()
    }
}
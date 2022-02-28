import Game from "../Game";
import GameState from "./GameState";

export default class GamePausedState extends GameState {
    constructor(game: Game) {
       super(game)
    }

    enter(prevState: GameState) {
        this.objects = prevState.gameObjects
    }

    handleInput(event: KeyboardEvent): void {
        if(event.code == 'Escape' && event.type == 'keydown') {
            this.game.setState(this.game.playingStateAfterPause)
        }
    }

    public run(): void {
        super.run()
        if(this.getFrame() > 1) {
            return
        }

        let objects = this.objects
        for (let i = 0; i < objects.length; i++) {
            objects[i].draw()
        }

        this.game.context().save()
        this.game.context().fillStyle = "#000"
        this.game.context().font = "50px Arial"
        this.game.context().textAlign = 'center'
        this.game.context().fillText('PAUSED', this.game.w() / 2, this.game.h() / 2)
        this.game.context().restore()
    }
}
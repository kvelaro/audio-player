import Game from "../Game";
import GameState from "./GameState";
import {GameLevels} from "../Levels/GameLevels";
import GamePlayingState from "./GamePlayingState";

export default class GameOverState extends GameState {
    constructor(game: Game) {
        super(game)
    }

    enter(prevState: GameState) {
        this.objects = prevState.gameObjects
        this.draw()
    }

    draw() {
        this.game.context().clearRect(0 ,0, this.game.w(), this.game.h())
        let objects = this.game.currentState().gameObjects
        for (let i = 0; i < objects.length; i++) {
           objects[i].draw()
        }
    }

    handleInput(event: KeyboardEvent): void {
        if(event.code == 'Space' && event.type == 'keydown') {
            this.game.setState(new GamePlayingState(this.game, new (<any>GameLevels)['Level1']()))
        }
    }

    public run(): void {
        super.run()
        if(this.getFrame() > 1) {
            return
        }
        this.game.context().save()
        this.game.context().fillStyle = "#000"
        this.game.context().font = "50px Arial"
        this.game.context().textAlign = 'center'
        this.game.context().fillText('GAME OVER', this.game.w() / 2, this.game.h() / 2)
        this.game.context().restore()
    }
}
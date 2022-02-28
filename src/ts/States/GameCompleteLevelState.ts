import Game from "../Game";
import GamePlayingState from "./GamePlayingState";
import GameState from "./GameState";
import {GameLevels} from "../Levels/GameLevels";
import Level from "../Level";

export default class GameCompleteLevelState extends GameState {
    protected prevLevel: Level
    constructor(game: Game) {
        super(game)
    }

    enter(prevState: GamePlayingState) {
        super.enter(prevState)
        this.prevLevel = prevState.level
        this.background()
    }

    handleInput(event: KeyboardEvent): void {
        if(event.code == 'Space' && event.type == 'keydown') {
            let levelNo = this.prevLevel.levelNo
            let className: any = `Level${++levelNo}`
            console.log(className)
            this.game.setState(new GamePlayingState(this.game, new (<any>GameLevels)[className]()))
        }
    }

    public run(): void {
        super.run()

        let objects = this.objects
        for (let i = 0; i < objects.length; i++) {
            objects[i].draw()
        }

        let lineHeight = 50
        let textLines = ['YOU WIN', 'PRESS SPACE TO ENTER NEXT LEVEL']
        this.game.context().save()
        this.game.context().fillStyle = "#000"
        this.game.context().font = "50px Arial"
        this.game.context().textAlign = 'center'
        for(let i = 0; i < textLines.length; i++) {
            this.game.context().fillText(textLines[i], this.game.w() / 2, this.game.h() / 2 + (i * lineHeight))
        }
        this.game.context().restore()
    }
}
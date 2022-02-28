import State from "../State";
import Game from "../Game";
import GameObject from "../GameObject";
import Cell from "../Cell";
import Money from "../Money";

export default abstract class GameState extends State {

    protected game: Game
    protected href: State
    protected frame: number
    protected objects: Array<GameObject>

    public constructor(game: Game) {
        super()
        this.game = game
        this.frame = 0
        this.objects = []
    }

    public background(): void {
        let cellWidth = Cell.width
        let cellHeight = Cell.height

        this.game.rows = Math.floor(this.game.h() / cellHeight)
        this.game.cols = Math.floor(this.game.w() / cellWidth)
        for (let i = 0; i <= this.game.rows; i++ ) {
            for (let j = 0; j <= this.game.cols; j++ ) {
                this.objects.push(new Cell(this.game, i, j))
            }
        }
        this.objects.push(new Money(this.game, this.game.w() - 200, 20))
    }

    // @ts-ignore
    public enter(prevState: GameState) {
        this.objects = []
    }

    public run(): void {
        this.frame++
    }

    public getFrame(): number {
        return this.frame
    }

    get gameObjects() {
        return this.objects
    }
}
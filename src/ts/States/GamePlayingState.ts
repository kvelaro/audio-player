import Game from "../Game";
import Money from "../Money";
import Cell from "../Cell";
import Defender from "../Defender";
import Collision from "../Collision";
import Pixel from "../Pixel";
import Soldier from "../Soldiers/Soldier";
import Sergeant from "../Soldiers/Sergeant";
import Ensign from "../Soldiers/Ensign";
import Lieutenant from "../Soldiers/Lieutenant";
import Corporal from "../Soldiers/Corporal";
import GamePausedState from "./GamePausedState";
import GameState from "./GameState";
import Level from "../Level";
import DefendersMenu from "../Menu/DefendersMenu";
import GameObject from "../GameObject";
import Invader from "../Invader";
import GameCompleteLevelState from "./GameCompleteLevelState";
import Wave from "../interfaces/Wave";
import SimpleZombie from "../Enemies/SimpleZombie";
import SoldierZombie from "../Enemies/SoldierZombie";
import VampireZombie from "../Enemies/VampireZombie";

export default class GamePlayingState extends GameState implements EventListenerObject {
    public level: Level
    protected wasPaused: boolean
    protected defendersMenu: DefendersMenu
    protected isAboutToComplete: boolean
    private waveTextInAction: number
    constructor(game: Game, level: Level) {
        super(game)
        this.level = level
        this.wasPaused = false
        this.defendersMenu = new DefendersMenu(this)
        this.isAboutToComplete = false
        this.waveTextInAction = 0
    }

    addListeners(): void {
        this.game.canvas().addEventListener('click', this)
    }

    canvasClicked(e: MouseEvent): void {
        let self = this
        let canvasRect = this.game.canvas().getBoundingClientRect()
        let x = e.x - canvasRect.left
        let y = e.y - canvasRect.top

        let selected = this.defendersMenu.getActiveDefenderClass()
        if(!selected) {
            return
        }

        let cellObjects:Array<Cell> = []
        let defenderObjects:Array<Defender> = []
        let moneyObject: Money

        this.objects.forEach(function(object) {
            if(object instanceof Cell) {
                cellObjects.push(object)
            }
            if(object instanceof Defender) {
                defenderObjects.push(object)
            }
            if(object instanceof Money) {
                moneyObject = object
            }
        })

        cellObjects.forEach(function(object) {
            if(
                Collision(object, new Pixel(x, y)) &&
                object.defenderExist == false &&
                object.isFullyDrawn()
            ) {

                let defender = null
                let price = 0
                switch (selected.toLowerCase()) {
                    case 'soldier':
                        defender = new Soldier(self.game, object.x + 1, object.y + 1)
                        price = Soldier.price
                        break;
                    case 'sergeant':
                        defender = new Sergeant(self.game, object.x + 1, object.y + 1)
                        price = Sergeant.price
                        break;
                    case 'ensign':
                        defender = new Ensign(self.game, object.x + 1, object.y + 1)
                        price = Ensign.price
                        break;
                    case 'lieutenant':
                        defender = new Lieutenant(self.game, object.x + 1, object.y + 1)
                        price = Lieutenant.price
                        break;
                    case 'corporal':
                        defender = new Corporal(self.game, object.x + 1, object.y + 1)
                        price = Corporal.price
                        break;
                    default:
                        break;
                }

                if(defender) {
                    if(moneyObject.getAmount() < price) {
                        return
                    }
                    moneyObject.addAmount(price * -1)
                    object.defenderExist = true
                    self.objects.push(defender)
                }
            }
        })
    }

    enter(prevState: GameState) {
        if (!this.wasPaused) {
            super.enter(prevState)
            this.background()
        }
        this.defendersMenu.draw()
        this.addListeners()
    }

    handleEvent(evt: Event): void {
        switch (evt.type) {
            case 'click':
                this.canvasClicked(<MouseEvent>evt)
                break
        }
    }

    handleInput(event: Event): void {
        if (event instanceof KeyboardEvent && event.type == 'keydown') {
            switch (event.code) {
                case 'Escape':
                    this.game.playingStateAfterPause = this
                    this.wasPaused = true
                    this.game.setState(new GamePausedState(this.game))
                    break
            }
        }
    }

    leave() {
        super.leave()
        this.defendersMenu.delete()
        this.removeListeners()
    }

    removeListeners(): void {
        this.game.canvas().removeEventListener('click', this)
    }

    run(): void {
        super.run()
        this.game.context().clearRect(0 ,0, this.game.w(), this.game.h())
        this.zombies()
        let objects = this.objects
        if(this.isAboutToComplete) {
            let filter = objects.filter(function (object: GameObject) {
                return (object instanceof Invader)
            })
            if(filter.length == 0) {
                this.game.setState(new GameCompleteLevelState(this.game))
            }
        }

        for (let i = 0; i < objects.length; i++) {
            if(objects[i] && objects[i].delete) {
                objects.splice(i, 1)
                continue
            }
            objects[i].draw()
            objects[i].update()
        }

        if(this.game.currentState() === this) {
            if(this.waveTextInAction && this.waveTextInAction < 100) {
                this.waveText(this.level.current())
                if(++this.waveTextInAction == 100) {
                    this.waveTextInAction = 0
                }
            }
        }
    }

    waveText(wave: number): void {
        this.game.context().save()
        this.game.context().fillStyle = "#000"
        this.game.context().font = "50px Arial"
        this.game.context().textAlign = 'center'
        this.game.context().fillText(`WAVE ${wave}`, this.game.w() / 2, this.game.h() / 2)
        this.game.context().restore()
    }

    zombie(rand = false): Invader {
        let zombieRandom = Math.floor(Math.random() * 3)
        let zombie = null
        let yPos = Math.floor(Math.random() * this.game.rows) * Cell.height
        let random = 1
        if(rand) {
            random = Math.floor(Math.random() * 1000)
        }
        switch (zombieRandom) {
            case 0:
                zombie = new SimpleZombie(this.game, this.game.w() + random, yPos + 1)
                break
            case 1:
                zombie = new SoldierZombie(this.game, this.game.w() + random, yPos + 1)
                break
            case 2:
                zombie = new VampireZombie(this.game, this.game.w() + random, yPos + 1)
                break
        }
        return zombie
    }

    zombies(): void {
        let bigWaveAtFrame = Math.floor(3000 - (this.level.levelNo - 1) * 250)
        let randomZombieAtFrame = Math.floor(100 - (this.level.levelNo) * 10)
        if(!this.isAboutToComplete) {
            if(this.getFrame() % bigWaveAtFrame == 0) {
                this.zombiesWave()
                this.waveTextInAction++
            }
            if(this.getFrame() % randomZombieAtFrame == 0) {
                this.objects.push(this.zombie())
            }
        }
    }

    zombiesWave(): void {
        let wavesExist = this.level.wavesExist()
        if(!wavesExist) {
            this.isAboutToComplete = true
        }
        else {
            let waveObj = <Wave>this.level.next()
            for(let i = 0; i < waveObj.zombieCount; i++) {
                this.objects.push(this.zombie())
            }
        }
    }

}
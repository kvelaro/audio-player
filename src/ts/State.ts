
export default abstract class State {

    public abstract enter(prevState: State): void

    abstract handleInput(event: Event): void

    public leave() {}
}

export class DeleteWordCommand {
    constructor(
        public readonly userId :string,
        public readonly wordId :string
    ){}
}
interface DeskContentProps {
    id: string;
    deskId: string;
    title: string;
    description?: string | null;
    ownerId: string;
}
export class DeskContent{
    constructor(
        private readonly props: DeskContentProps
    ){}
    get id () {
        return this.props.id;
    }
    get ownerId() {
        return this.props.ownerId;
    }
    get deskId() {
        return this.props.deskId;
    }
    get title() {
        return this.props.title;
    }
    get description() {
        return this.props.description;
    }
}
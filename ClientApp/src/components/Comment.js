class Comment {
    constructor(user, content, type, id) {
        this.user = user;
        this.content = content;
        this.type = type;
        this.id = id;
        this.date = new Date();
        this.children = [];
    }

    add_child(child) {
        this.children.push(child);
    }
}

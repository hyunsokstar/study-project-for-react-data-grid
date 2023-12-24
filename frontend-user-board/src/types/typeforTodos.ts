export interface IManager {
    id: number;
    email: string;
    password: string;
    nickname: string;
    role: string;
    gender: string;
    phoneNumber: string | null;
    backEndLevel: number;
    frontEndLevel: number;
    profileImage: string;
}

export interface ITypeForTodoRow {
    id: number;
    task: string;
    details: string;
    status: string;
    startTime: string;
    deadline: string;
    priority: number;
    manager: IManager;
    supervisor: IManager | null;
}

export interface ITypeForToDosList {
    todoList: ITypeForTodoRow[];
    totalCount: number;
    perPage: number;
}

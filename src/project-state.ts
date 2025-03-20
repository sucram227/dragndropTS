import { ProjectStatus } from "./interfaces/project-status.js";
import { Project } from "./interfaces/project.js";

//Project State Mangement
class State<T> {
    protected listeners: Listener<T>[] = [];

    addListener(listenerFn: Listener<T>) {
        this.listeners.push(listenerFn);
    }
}

type Listener<T> = (items: T[]) => void;

export class ProjectState extends State<Project> {
    private projects: Project[] = [];
    private static instance: ProjectState;

    constructor() {
        super();
    }

    static getInstance() {
        if (this.instance) {
            return this.instance;
        }
        this.instance = new ProjectState();
        return this.instance;
 }

    addProject(title: string, description: string, numOfPeople: number) { 
        const newProject = new Project(
            Math.random().toString(),
            title,
            description,
            numOfPeople,
            ProjectStatus.Active
        );

        this.projects.push(newProject);

        this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
        const project = this.projects.find(prj => prj.id === projectId);
        if (project && project.status !== newStatus) {
            project.status = newStatus;
            this.updateListeners();
        }
    }

    private updateListeners() {
        for (const listenerFn of this.listeners) {
            listenerFn(this.projects.slice());
        }
    }
}

export const projectState = ProjectState.getInstance();   //Global Project State Object
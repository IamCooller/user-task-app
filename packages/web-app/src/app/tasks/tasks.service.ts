import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Task } from "@take-home/shared";
import { StorageService } from "../storage/storage.service";

@Injectable({ providedIn: "root" })
export class TasksService {
	tasks: Task[] = [];

	constructor(private http: HttpClient, private storageService: StorageService) {}

	getTasksFromApi(): Observable<Task[]> {
		const endpointUrl = "/api/tasks";
		return this.http.get<Task[]>(endpointUrl);
	}

	async getTasksFromStorage(): Promise<void> {
		this.tasks = await this.storageService.getTasks();
		this.filterTask("isArchived");
	}

	/**
	 * Filters the tasks array based on the specified key.
	 *
	 * @param key - The key to filter the tasks by. It can be one of the following:
	 *  - "isArchived": Filters out archived tasks.
	 *  - "priority": Filters tasks to only include those with a "HIGH" priority.
	 *  - "scheduledDate": Filters tasks to only include those scheduled for today.
	 *  - "completed": Filters out completed tasks.
	 */

	filterTask(key: keyof Task): void {
		switch (key) {
			case "isArchived":
				this.tasks = this.tasks.filter((task) => !task.isArchived);
				break;
			case "priority":
				this.tasks = this.tasks.filter((task) => task.priority === "HIGH");
				break;
			case "scheduledDate":
				const today = new Date().toDateString();

				this.tasks = this.tasks.filter((task) => {
					const taskDate = new Date(task.scheduledDate).toDateString();
					return taskDate === today;
				});
				break;

			case "completed":
				this.tasks = this.tasks.filter((task) => !task.completed);
		}
	}

	searchTask(search: string): void {
		if (search) {
			// TODO: filter tasks which title include search value
			throw new Error("Not implemented");
		} else {
			// TODO: reload all tasks from storage
			throw new Error("Not implemented");
		}
	}
}

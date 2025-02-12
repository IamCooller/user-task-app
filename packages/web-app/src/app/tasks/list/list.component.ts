import { Component } from "@angular/core";

import { Task } from "@take-home/shared";
import { take } from "rxjs";
import { TasksService } from "../tasks.service";
import { Router } from "@angular/router";
import { StorageService } from "../../storage/storage.service";

@Component({
	selector: "take-home-list-component",
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"],
	standalone: false,
})
export class ListComponent {
	constructor(private storageService: StorageService, protected tasksService: TasksService, private router: Router) {
		this.getTaskList();
	}

	/**
	 * Set the given task as completed and persist the update.
	 *
	 * @param item the task to mark as completed
	 */
	onDoneTask(item: Task): void {
		item.completed = true;

		this.storageService.updateTaskItem(item);
	}

	/**
	 * Mark the given task as archived and persist the update.
	 *
	 * @param item the task to archive
	 */
	onDeleteTask(item: Task): void {
		item.isArchived = true;

		this.storageService
			.updateTaskItem(item)
			.then(() => {
				this.tasksService.getTasksFromStorage();
			})
			.catch((error) => {
				console.error("Error deleting task:", error);
			});
	}

	onAddTask(): void {
		this.router.navigate(["/add"]);
	}

	private getTaskList(): void {
		this.tasksService
			.getTasksFromApi()
			.pipe(take(1))
			.subscribe(async (tasks) => {
				tasks.forEach(async (task) => {
					await this.storageService.updateTaskItem(task);
				});
				await this.tasksService.getTasksFromStorage();
			});
	}
}

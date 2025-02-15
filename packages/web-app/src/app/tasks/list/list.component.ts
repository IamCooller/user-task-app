import { Component } from "@angular/core";

import { Task, TaskPriority } from "@take-home/shared";
import { take } from "rxjs";
import { TasksService } from "../tasks.service";
import { Router } from "@angular/router";
import { StorageService } from "../../storage/storage.service";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";

@Component({
	selector: "take-home-list-component",
	templateUrl: "./list.component.html",
	styleUrls: ["./list.component.scss"],
	standalone: false,
	animations: [
		trigger("listAnimation", [
			transition("* <=> *", [
				query(":enter", [style({ opacity: 0, transform: "translateY(-20px)" }), stagger("50ms", [animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))])], {
					optional: true,
				}),
			]),
		]),
	],
})
export class ListComponent {
	constructor(private storageService: StorageService, protected tasksService: TasksService, private router: Router) {
		this.getTaskList();
	}

	/**
	 * Given a task priority, returns a class name which represents the priority as a string.
	 * The class names are: "high-priority", "medium-priority", or "low-priority".
	 * If the given priority is not recognized, an empty string is returned.
	 * @param priority the task priority
	 * @returns a class name that represents the priority
	 */
	getPriorityClass(priority: TaskPriority): string {
		switch (priority) {
			case TaskPriority.HIGH:
				return "high-priority";
			case TaskPriority.MEDIUM:
				return "medium-priority";
			case TaskPriority.LOW:
				return "low-priority";
			default:
				return "";
		}
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

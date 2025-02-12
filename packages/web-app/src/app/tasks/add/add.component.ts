import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Task, TaskPriority } from "@take-home/shared";
import { StorageService } from "../../storage/storage.service";
import { faker } from "@faker-js/faker";

@Component({
	selector: "take-home-add-component",
	templateUrl: "./add.component.html",
	styleUrls: ["./add.component.scss"],
	standalone: false,
})
export class AddComponent {
	protected addTaskForm: FormGroup = new FormGroup({
		title: new FormControl(null, {
			// TODO: add validators for required and min length 10
			validators: [Validators.required, Validators.minLength(10)],
		}),
		description: new FormControl(null),
		priority: new FormControl(
			{ value: TaskPriority.MEDIUM, disabled: false },
			{
				validators: Validators.required,
			}
		),
	});
	protected priorities = Object.values(TaskPriority);

	constructor(private storageService: StorageService, private router: Router) {}

	onSubmit() {
		if (this.addTaskForm.valid) {
			const newTask: Task = {
				...this.addTaskForm.getRawValue(),
				uuid: faker.string.uuid(),
				isArchived: false,
				scheduledDate: new Date(),
			};

			this.storageService.addTaskItem(newTask);

			this.router.navigate(["/"]);
		}
	}

	onCancel(): void {
		this.router.navigate(["/"]);
	}
}

import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Task, TaskPriority } from "@take-home/shared";
import { StorageService } from "../../storage/storage.service";
import { faker } from "@faker-js/faker";
import { scheduled } from "rxjs";

@Component({
	selector: "take-home-add-component",
	templateUrl: "./add.component.html",
	styleUrls: ["./add.component.scss"],
	standalone: false,
})
export class AddComponent {
	protected addTaskForm: FormGroup = new FormGroup({
		title: new FormControl(null, {
			validators: [Validators.required, Validators.minLength(10)], // validate title length to be at least 10 characters
		}),
		description: new FormControl(null),
		priority: new FormControl(
			{ value: TaskPriority.MEDIUM, disabled: false },
			{
				validators: Validators.required,
			}
		),
		scheduledDate: new FormControl(new Date(), { validators: Validators.required }),
	});
	protected priorities = Object.values(TaskPriority);

	constructor(private storageService: StorageService, private router: Router) {}

	today: Date = new Date();
	maxDate: Date = new Date(new Date().setDate(this.today.getDate() + 7));

	onSubmit() {
		if (this.addTaskForm.valid) {
			const newTask: Task = {
				...this.addTaskForm.getRawValue(),
				uuid: faker.string.uuid(),
				isArchived: false,
			};

			this.storageService.addTaskItem(newTask);

			this.router.navigate(["/"]);
		}
	}

	onCancel(): void {
		this.router.navigate(["/"]);
	}
}

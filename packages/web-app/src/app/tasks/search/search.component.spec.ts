import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule } from "@angular/platform-browser";
import { SearchComponent } from "./search.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { TasksService } from "../tasks.service";
import { Task, TaskPriority } from "@take-home/shared";

class MockTasksService {
	searchTask(): void {
		return;
	}
}

describe("SearchComponent", () => {
	let fixture: ComponentFixture<SearchComponent>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [BrowserModule, BrowserAnimationsModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
			declarations: [SearchComponent],
			providers: [{ provide: TasksService, useClass: MockTasksService }],
		});

		fixture = TestBed.createComponent(SearchComponent);
	});
	describe("TasksService - Fuzzy Search", () => {
		let service: TasksService;

		const tasks: Task[] = [
			{ uuid: "1", title: "Go home", description: "Task 1", priority: TaskPriority.HIGH, isArchived: false, completed: false, scheduledDate: new Date() },
			{ uuid: "2", title: "Clean the house", description: "Task 2", priority: TaskPriority.MEDIUM, isArchived: false, completed: false, scheduledDate: new Date() },
			{ uuid: "3", title: "Work from home", description: "Task 3", priority: TaskPriority.LOW, isArchived: false, completed: false, scheduledDate: new Date() },
		];

		beforeEach(() => {
			TestBed.configureTestingModule({});
			service = TestBed.inject(TasksService);
			service.tasks = tasks;
		});

		it("should return tasks that fuzzy match the search term", () => {
			service.searchTask("hoem");
			const resultTitles = service.tasks.map((task) => task.title);
			expect(resultTitles).toContain("Go home");
			expect(resultTitles).toContain("Work from home");
		});

		it("should reload tasks from storage if search is empty", () => {
			const spy = jest.spyOn(service, "getTasksFromStorage").mockImplementation(() => Promise.resolve());
			service.searchTask("");
			expect(spy).toHaveBeenCalled();
		});
	});
	it("should create", () => {
		expect(fixture.componentInstance).toBeDefined();
	});
});

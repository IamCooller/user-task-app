import { ComponentFixture, TestBed } from "@angular/core/testing";
import { BrowserModule, By } from "@angular/platform-browser";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { StorageService } from "../../storage/storage.service";
import { AddComponent } from "./add.component";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { TestbedHarnessEnvironment } from "@angular/cdk/testing/testbed";
import { Router } from "@angular/router";
import { MatButtonHarness } from "@angular/material/button/testing";
import { HarnessLoader } from "@angular/cdk/testing";
import { MatDatepickerInputHarness } from "@angular/material/datepicker/testing";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { Task } from "@take-home/shared";
class MockStorageService {
	addTaskItem(task: Task): Promise<void> {
		return Promise.resolve();
	}
}

describe("AddComponent", () => {
	let fixture: ComponentFixture<AddComponent>;
	let loader: HarnessLoader;
	let component: AddComponent;
	let storageService: StorageService;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				BrowserModule,
				BrowserAnimationsModule,
				FormsModule,
				ReactiveFormsModule,
				MatButtonModule,
				MatFormFieldModule,
				MatInputModule,
				MatSelectModule,
				MatDatepickerModule,
				MatNativeDateModule,
			],
			declarations: [AddComponent],
			providers: [{ provide: StorageService, useClass: MockStorageService }],
		}).compileComponents();
	});

	beforeEach(() => {
		router = TestBed.inject(Router);
		storageService = TestBed.inject(StorageService);
		fixture = TestBed.createComponent(AddComponent);
		component = fixture.componentInstance;
		loader = TestbedHarnessEnvironment.loader(fixture);
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(fixture.componentInstance).toBeDefined();
	});

	it("should display the title", () => {
		const title = fixture.debugElement.query(By.css("h1"));
		expect(title.nativeElement.textContent).toEqual("Add Task");
	});

	it(`should navigate to home when cancel button is clicked`, async () => {
		jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);
		jest.spyOn(component, "onCancel");
		const cancelButton = await loader.getHarness(MatButtonHarness.with({ selector: '[data-testid="cancel"]' }));
		await cancelButton.click();
		fixture.detectChanges();
		expect(component.onCancel).toHaveBeenCalledTimes(1);
		expect(router.navigateByUrl).toHaveBeenCalled();
		const navArg = (router.navigateByUrl as jest.Mock).mock.calls[0][0];
		expect(navArg.toString()).toEqual("/");
	});

	it(`should prevent adding task without a valid title`, async () => {
		const addButton = await loader.getHarness(MatButtonHarness.with({ selector: '[data-testid="add-task"]' }));
		expect(await addButton.isDisabled()).toBeTruthy();
		component["addTaskForm"].controls["title"].setValue("Invalid");
		fixture.detectChanges();
		expect(await addButton.isDisabled()).toBeTruthy();
		component["addTaskForm"].controls["title"].setValue("This is a valid title");
		fixture.detectChanges();
		expect(await addButton.isDisabled()).toBeFalsy();
	});

	it("should have a scheduled date picker with correct min and max constraints", async () => {
		const datepickerInput = await loader.getHarness(MatDatepickerInputHarness.with({ selector: '[formControlName="scheduledDate"]' }));

		const minValue = await datepickerInput.getMin();
		const maxValue = await datepickerInput.getMax();

		const formatDate = (date: Date) => date.toISOString().split("T")[0];

		expect(minValue).toEqual(formatDate(component.today));
		expect(maxValue).toEqual(formatDate(component.maxDate));
	});

	it(`should create a new task for a valid submission and navigate home`, async () => {
		jest.spyOn(router, "navigateByUrl").mockResolvedValue(true);
		jest.spyOn(component, "onSubmit");
		jest.spyOn(storageService, "addTaskItem").mockResolvedValue();
		component["addTaskForm"].controls["title"].setValue("Adding a test task");
		component["addTaskForm"].controls["description"].setValue("This task should be added to the list");
		fixture.detectChanges();
		const addButton = await loader.getHarness(MatButtonHarness.with({ selector: '[data-testid="add-task"]' }));
		await addButton.click();
		fixture.detectChanges();
		expect(component.onSubmit).toBeCalledTimes(1);
		expect(storageService.addTaskItem).toBeCalledTimes(1);
		expect(storageService.addTaskItem).toBeCalledWith(
			expect.objectContaining({
				isArchived: false,
				title: "Adding a test task",
				description: "This task should be added to the list",
			})
		);
		expect(router.navigateByUrl).toHaveBeenCalled();
		const navArg = (router.navigateByUrl as jest.Mock).mock.calls[0][0];
		expect(navArg.toString()).toEqual("/");
	});
});

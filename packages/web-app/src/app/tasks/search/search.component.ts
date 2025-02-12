import { Component } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { TasksService } from "../tasks.service";
import { debounceTime, distinctUntilChanged } from "rxjs";

@Component({
	selector: "take-home-search-component",
	templateUrl: "./search.component.html",
	styleUrls: ["./search.component.scss"],
	standalone: false,
})
export class SearchComponent {
	protected searchForm: FormGroup = new FormGroup({
		search: new FormControl(""),
	});

	constructor(private taskService: TasksService) {
		this.searchForm.controls["search"].valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe((searchValue) => {
			this.taskService.searchTask(searchValue);
		});
	}

	onSubmit(): void {
		const searchValue = this.searchForm.value.search;
		this.taskService.searchTask(searchValue);
	}
}

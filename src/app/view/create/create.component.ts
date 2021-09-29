import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  employeeForm!: FormGroup
  isChecked = false;
  valueJobTitle = "";
  valueArea = "";
  countries = [{ value: "", text: "" }]

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.loadCountries()
    this.initForms()
  }

  back() {
    this.router.navigate(["/"])
  }

  loadCountries() {
    this.employeeService.getCountries().subscribe(
      p => {
        this.countries = p !== undefined ? p : []
      },
      e => { console.log(e) },
      () => {
        console.log(this.countries)
      }
    )
  }

  initForms() {
    this.employeeForm = this.formBuilder.group({
      name: new FormControl("", [Validators.required]),
      dateOfBirth: new FormControl("", [Validators.required]),
      country: new FormControl("", [Validators.required]),
      userName: new FormControl("", [Validators.required, Validators.pattern('[A-Za-z0-9]+')]),
      hiringDate: new FormControl("", [Validators.required]),
      state: new FormControl(""),
      area: new FormControl("", [Validators.required]),
      jobTitle: new FormControl("", [Validators.required]),
      commission: new FormControl("0", [Validators.required])
    })
  }

  createEmployee(form: FormGroup) {
    console.log(form)
    if (form.valid) {
    }
  }

  getErrorMessage(component: string) {
    let errorMessage = ""
    switch (component) {
      case "password":
        errorMessage = this.employeeForm.get("password")!.hasError("required")
          ? "Campo requerido"
          : ""
        break
    }
    return errorMessage
  }

}

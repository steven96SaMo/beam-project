import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/service/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

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
    public dialog: MatDialog,
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

      /* validar edad si no, mando este mensaje pero si si, mando otro mensaje el empleado tal se registró */

      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        width: "350px",
        data: "Recuerda que la edad del empleado debe ser mayor a 18 años"
      })

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
        }
      })





    }
  }

  getErrorMessage(component: string) {
    let errorMessage = ""
    switch (component) {
      case "name":
        errorMessage = this.employeeForm.get("name")!.hasError("required")
          ? "Campo Nombre requerido"
          : ""
        break
      case "dateOfBirth":
        errorMessage = this.employeeForm.get("dateOfBirth")!.hasError("required")
          ? "Campo Fecha de nacimiento requerido"
          : ""
        break
      case "country":
        errorMessage = this.employeeForm.get("country")!.hasError("required")
          ? "Campo País requerido"
          : ""
        break
      case "userName":
        errorMessage = this.employeeForm.get("userName")!.hasError("required")
          ? "Campo Nombre de usuario requerido"
          : ""
        errorMessage = this.employeeForm.get("userName")!.hasError("pattern")
          ? "El nombre de usuario no debe contener caracteres especiales"
          : ""
        break
      case "hiringDate":
        errorMessage = this.employeeForm.get("hiringDate")!.hasError("required")
          ? "Campo Fecha de contratación requerido"
          : ""
        break
      case "jobTitle":
        errorMessage = this.employeeForm.get("jobTitle")!.hasError("required")
          ? "Campo Cargo requerido"
          : ""
        break
      case "commission":
        errorMessage = this.employeeForm.get("commission")!.hasError("required")
          ? "Campo Comisión requerido"
          : ""
        break
    }
    return errorMessage
  }

}

import { Component, OnInit } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { EmployeeService } from 'src/app/service/employee.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { Employee } from 'src/app/model/employee';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  employeeForm: FormGroup
  employee: Employee
  employeeId = ""
  isChecked = false;
  valueJobTitle = "";
  valueArea = "";
  countries = [{ value: "", text: "" }]

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loadCountries()
    this.initForms()
    this.loadEmployee()
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

  loadEmployee() {
    this.employeeId = this.route.snapshot.paramMap.get("id")!;
    this.employeeService.getEmployee(this.employeeId).subscribe(
      p => {
        console.log(p);
        this.employee = p.results[0] !== undefined ? p.results[0] : []
      },
      e => { console.log(e) },
      () => {
        this.loadData()
      }
    )
  }

  loadData() {
    this.employeeForm.controls["name"].setValue(this.employee.name)
    this.employeeForm.controls["dateOfBirth"].setValue(this.employee.dateOfBirth)
    this.employeeForm.controls["country"].setValue(this.employee.country)
    this.employeeForm.controls["userName"].setValue(this.employee.userName)
    this.employeeForm.controls["hiringDate"].setValue(this.employee.hiringDate)
    if (this.employee.state == "1") {
      this.employeeForm.controls["state"].setValue(true)
      this.isChecked = true
    } else {
      this.employeeForm.controls["state"].setValue(false)
      this.isChecked = false
    }
    this.employeeForm.controls["area"].setValue(this.employee.area)
    this.valueArea = this.employee.area
    this.employeeForm.controls["jobTitle"].setValue(this.employee.jobTitle)
    this.valueJobTitle = this.employee.jobTitle
    this.employeeForm.controls["commission"].setValue(this.employee.commission)
  }

  updateEmployee(form: FormGroup) {
    if (form.valid) {
      let age = this.calculateAge(form.value.dateOfBirth)
      if (age < 18) {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: "350px",
          data: "Recuerda que la edad del empleado debe ser mayor o igual a 18 años"
        })
        dialogRef.afterClosed().subscribe(result => { })
      } else {
        // id
        form.value["id"] = this.employeeId;

        // Validate state
        if (form.value.state == true) {
          form.value.state = "1"
        } else {
          form.value.state = "0"
        }
        // Validate commision
        if (form.value.jobTitle != "Fundador y CEO") {
          form.value.commission = 0
        }
        //Modal
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
          width: "350px",
          data: "Usuario " + form.value.name + ", actualizado correctamente."
        })
        dialogRef.afterClosed().subscribe(result => {
          console.log(form.value)
          this.employeeService.updateEmployee(form.value).subscribe(
            p => {
              console.log(p);
            },
            e => { console.log(e) },
            () => {
              this.router.navigate(["/"])
            }
          )
        })
      }
    }
  }


  calculateAge(dateOfBirth: string) {
    let today = new Date();
    let birthday = new Date(dateOfBirth);
    let age = today.getFullYear() - birthday.getFullYear();
    let month = today.getMonth() - birthday.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }

    return age;
  }

  getErrorMessage(component: string) {
    let errorMessage = ""
    switch (component) {
      case "name":
        errorMessage = this.employeeForm.get("name")?.hasError("required")
          ? "Campo Nombre requerido"
          : ""
        break
      case "dateOfBirth":
        errorMessage = this.employeeForm.get("dateOfBirth")?.hasError("required")
          ? "Campo Fecha de nacimiento requerido"
          : ""
        break
      case "country":
        errorMessage = this.employeeForm.get("country")?.hasError("required")
          ? "Campo País requerido"
          : ""
        break
      case "userName":
        errorMessage = this.employeeForm.get("userName")?.hasError("required")
          ? "Campo Nombre de usuario requerido"
          : ""
        errorMessage = this.employeeForm.get("userName")?.hasError("pattern")
          ? "El nombre de usuario no debe contener caracteres especiales"
          : ""
        break
      case "hiringDate":
        errorMessage = this.employeeForm.get("hiringDate")?.hasError("required")
          ? "Campo Fecha de contratación requerido"
          : ""
        break
      case "jobTitle":
        errorMessage = this.employeeForm.get("jobTitle")?.hasError("required")
          ? "Campo Cargo requerido"
          : ""
        break
      case "commission":
        errorMessage = this.employeeForm.get("commission")?.hasError("required")
          ? "Campo Comisión requerido"
          : ""
        break
    }
    return errorMessage
  }
}

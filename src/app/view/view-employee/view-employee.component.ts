import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { EmployeeService } from 'src/app/service/employee.service';

@Component({
  selector: 'app-view-employee',
  templateUrl: './view-employee.component.html',
  styleUrls: ['./view-employee.component.scss']
})
export class ViewEmployeeComponent implements OnInit {

  employee: Employee;
  employeeId = "";
  isChecked = false;
  valueJobTitle = "";
  valueArea = "";
  countries = [{ value: "", text: "" }];
  name = "";
  dateOfBirth = "";
  country = "";
  userName = "";
  hiringDate = "";
  state = false;
  area = "";
  jobTitle = "";
  commission = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
  ) { }

  ngOnInit(): void {
    this.loadCountries()
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
    this.name = this.employee.name;
    this.dateOfBirth = this.employee.dateOfBirth;
    this.country = this.employee.country;
    this.userName = this.employee.userName;
    this.hiringDate = this.employee.hiringDate;
    if (this.employee.state == "1") {
      this.state = true;
      this.isChecked = true
    } else {
      this.state = false;
      this.isChecked = false;
    }
    this.valueArea = this.employee.area;
    this.valueJobTitle = this.employee.jobTitle;
    this.commission = this.employee.commission;
  }

}

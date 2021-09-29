import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Employee } from 'src/app/model/employee';
import { EmployeeService } from 'src/app/service/employee.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['name_jobTitle', 'dateOfBirth', 'hiringDate', 'actions'];
  employee: Employee[] = []
  employeeDataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor(
    private router: Router,
    private employeeService: EmployeeService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.getEmployeeData();
  }

  getEmployeeData() {
    this.employeeService.getAllEmployees().subscribe(
      p => {
        console.log(p);
        this.employee = p.results !== undefined ? p.results : []
        this.calculateAge(this.employee);
      },
      e => { console.log(e) },
      () => {
        this.setObjectDataSource();
        this.employeeDataSource.paginator = this.paginator;
        this.employeeDataSource.sort = this.sort;
      }
    )
  }

  calculateAge(employeeArr: Employee[]) {
    employeeArr.map((item) => {
      let today = new Date();
      let birthday = new Date(item.dateOfBirth);
      let age = today.getFullYear() - birthday.getFullYear();
      let month = today.getMonth() - birthday.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }
      item["age"] = age.toString();
    })
  }

  // set data on table
  setObjectDataSource() {
    this.employeeDataSource = new MatTableDataSource(this.employee)
    this.employeeDataSource.filterPredicate = function (
      data: Employee,
      filterValue: string
    ) {
      return (
        data.name
          .trim()
          .toLocaleLowerCase()
          .indexOf(filterValue.trim().toLocaleLowerCase()) >= 0 ||
        data.jobTitle
          .trim()
          .toLocaleLowerCase()
          .indexOf(filterValue.trim().toLocaleLowerCase()) >= 0 ||
        data.hiringDate
          .trim()
          .toLocaleLowerCase()
          .indexOf(filterValue.trim().toLocaleLowerCase()) >= 0
      )
    }
  }

  /* Method in charge of filtering the information in the table */
  applyObjectFilter(filterValue: string) {
    filterValue = filterValue.trim() // Remove whitespace
    filterValue = filterValue.toLowerCase() // MatTableDataSource defaults to lowercase matches
    this.employeeDataSource.filter = filterValue
  }

  createEmployee() {
    console.log("CREAR")
    this.router.navigate(["/create"])
  }

  editEmployee(employee: Employee) {
    console.log("EDITAR")
  }

  viewEmployee(employee: Employee) {
    console.log("VER")
  }

  deleteEmployee(employee: Employee) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "350px",
      data: "¿Estás seguro que quieres borrar este empleado?"
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.employeeService.deleteEmployee(employee).subscribe(
          p => {
            console.log(p)
          },
          e => { console.log(e) },
          () => {
            this.getEmployeeData()
          }
        )
      }
    })
  }

}

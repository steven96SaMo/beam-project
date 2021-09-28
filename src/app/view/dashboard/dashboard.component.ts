import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/model/employee';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  displayedColumns: string[] = ['name_jobTitle', 'dateOfBirth', 'hiringDate', 'actions'];
  employee: Employee[] = [
    {
      name: "hola",
      dateOfBirth: "2021/09/11",
      country: "Colombia",
      userName: "Steven",
      hiringDate: "2021/09/11",
      state: "1",
      area: "Tecnica",
      jobTitle: "Desarrollador",
      commission: "10%"
    },
    {
      name: "hola",
      dateOfBirth: "2021/09/11",
      country: "Colombia",
      userName: "Steven",
      hiringDate: "2021/09/11",
      state: "1",
      area: "Tecnica",
      jobTitle: "Desarrollador",
      commission: "10%"
    },
  ]
  employeeDataSource!: MatTableDataSource<Employee>;

  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  constructor() { }

  ngOnInit(): void {
    this.getUserData()
  }

  ngAfterViewInit() {
    this.employeeDataSource.paginator = this.paginator;
    this.employeeDataSource.sort = this.sort;
  }

  getUserData() {
    /* this.viewUserService.getUsers().subscribe(
      p => {
        console.log(p)
        this.user = p.results !== undefined ? p.results : []
      },
      e => { console.log(e), this.launchMessage(e) },
      () => {
        this.setObjectDataSource()
      }
    ) */
    this.setObjectDataSource()
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
}

import { Component, OnInit } from '@angular/core';
import { InternService } from './../../../core/services/intern.service';
import { Logger } from './../../../core/helpers/logger';
import { Intern } from './../../../core/models/intern';
import { take } from 'rxjs/operators';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-intern-table',
  templateUrl: './intern-table.component.html',
  styleUrls: ['./intern-table.component.scss']
})
export class InternTableComponent implements OnInit {
 public static sortOrder: number = 1;

 public interns: Intern[] = [];

 // injection du service
  constructor(
    private internService: InternService //dependency Injection (D de solid)
  ) { }

  ngOnInit(): void {
    this.internService.findAll()
      .subscribe((interns: Intern[]) => {
        this.interns = interns;
        Logger.info(`je viens d'être notifie`)
      })
      Logger.info(`Hello, je poursuis l'execution`)
  }

  public onDelete (intern: Intern): void {
    this.internService.delete(intern)    // on veut just recup l'observable qui observe une rep http
      .pipe(
        take(1)    //take dans le pipe
      ).subscribe((response: HttpResponse<any>) => {
        if (response.status === 204){
          this.interns.splice(
            this.interns.findIndex((obj: Intern) => obj.id === intern.id),
            1
          );
        }
      })
  }


 //trier par ordre croissant
  public sortByName(): void {
    Logger.info(`Before sort, sortOder is ${InternTableComponent.sortOrder}`)
    this.internService.interns.sort(
      InternTableComponent.sortName
    );
    InternTableComponent.sortOrder = InternTableComponent.sortOrder * -1;
    console.log(`After sort, sortOder is ${InternTableComponent.sortOrder}`)
  }


  //Static
  private static sortName(intern1: Intern, intern2: Intern): number {
    if (intern1.name > intern2.name){
      return 1 * InternTableComponent.sortOrder;
    } else if (intern1.name < intern2.name) {
      return -1 * InternTableComponent.sortOrder;
    } else {
      return 0 * InternTableComponent.sortOrder;
    }
  }







}

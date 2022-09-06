import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Logger } from '../helpers/logger';
import { ICrud } from '../interfaces/i-crud';
import { Intern } from '../models/intern';
import { environment } from './../../../environments/environment';
import { map, take, throwIfEmpty } from 'rxjs/operators';
import { BehaviorSubject, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class InternService implements ICrud<Intern>{

  public interns: Intern[] = []

  private itemNumber$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  public constructor(
    private httpClient: HttpClient
  ) {}


  public get itemNumber(): BehaviorSubject<number>{
    return this.itemNumber$    //je retourne l'attribut
  }







   //ajout des methodes de l'interface Icrud
  findAll(): Observable<Intern[]>  {
    //let itemNumber: number = 0;        // on defini une variable
    return this.httpClient.get<any>(
      `${environment.apiRoot}intern` // http://217.0.0.1:5000/inter
    ) //je recupere mon observable<ça>
    .pipe(
      take(1), // recup tt le tableau
      map((rawInterns:any) =>{    // map rxjs = transforme un Observable en un autre Observable
        //itemNumber = rawInterns.length;
        this.itemNumber$.next(rawInterns.length);  // emet la nouvelle valeur
        return rawInterns.map((rawIntern: any) => {
          //J'ai besoin de créer un Objet InterModel à partir d'un rawIntern
          const intern: Intern = new Intern();
          intern.id = rawIntern.id;
          intern.name = rawIntern.name;
          intern.firstname = rawIntern.firstname;
          intern.birthDate = new Date (rawIntern.birthDate);
          intern.phoneNumber = rawIntern.phoneNumber;
          intern.email = rawIntern.email;
          intern.address = rawIntern.address;
          return intern;
        })
      })
    )
    ;
  }

  findOne(id: number): Observable<Intern> {
   return this.httpClient.get<any>(
      `${environment.apiRoot}intern/${id}`,      // http://127.0.0.1/intern/999
      {
        observe: 'response'     // si on observe pas la rep, on aura pas le status
      }
    )
    .pipe(
      take(1),
      map((response : HttpResponse<any>) => {
        if (response.status === 200) {
          //Récupère le "ça" et en faire un vrai Intern
          const rawIntern: any = response.body;
          const intern: Intern = new Intern();
          intern.id = rawIntern.id;
          intern.name = rawIntern.name;
          intern.firstname = rawIntern.firstname;
          intern.birthDate = new Date (rawIntern.birthDate);
          intern.phoneNumber = rawIntern.phoneNumber;
          intern.email = rawIntern.email;
          intern.address = rawIntern.address;

          return intern;
        } else {
          throw new Error(`Inter with ${id} was not found!`)
        }
      }),
      throwIfEmpty(() => new Error (`Inter with ${id} was not found!`))
    )
  }
    // const intern: Intern | undefined = this.interns.find(
    //   (obj: Intern) => obj.id === id
    // )
    // return (intern === undefined) ? null : intern;


/*
ou
    if (intern === undefined) {
      return null;
    }
    return intern;
*/



  public getItemNumber(): number {
    return this.interns.length
  }

  public delete(intern: Intern): Observable<HttpResponse<any>> {
    this.itemNumber$.next(this.itemNumber$.getValue() - 1)
    return this.httpClient.delete(
      `${environment.apiRoot}intern`, // URI   http://127.0.0.1:5000/intern je m'adresse à mon back end avec le verbe delete
      {
        body: intern,
        observe: 'response'
      }
    );
  }


  public add(intern: Intern): void{
    if (this.findOne(intern.id!) === null) {
      this.interns.push(intern);
    }
  }

  public update(intern:Intern): void{

    // let oldIntern: Intern | null = this.findOne(intern.id!);
    // if (oldIntern !== null) {
    //   oldIntern = {id: oldIntern.id, ...intern};
    // }
  }

  public getAll(): Intern[] {
    return this.interns
  }

  public getOne(index: number) : Intern {
    return this.interns[index]
  }


  // ajout un id au nouvel eleve
  public getNextId():number{
    return this.interns.sort(
      (intern1:Intern, intern2:Intern) => {     //fonction de tri. 3 conditions
        return (intern1.id! -intern2.id!)*-1
      }
    )[0].id! + 1
  }

}

import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
@Injectable()
export class LoginPage {

  constructor(private  router: Router, private http: HttpClient, private alertCtrl: AlertController, private storage: Storage) {
    this.storage.get('id').then((val) => {
      if (val != null) {
        this.router.navigateByUrl('/app/tabs/search');
      }
    });
  }

  navTabs(form) {
    let mode = '';
    if (form.value.email != null && form.value.password != null) {
      mode = form.value.email;
    } else {
      mode = 'all';
    }

    this.getData(mode)
    .then(data => {
      if (data[0].password === form.value.password) {
        this.storage.set('id', data[0].user_id);
        this.storage.set('first_name', data[0].first_name);
        this.storage.set('last_name', data[0].last_name);
        this.router.navigateByUrl('/app/tabs/search');
      } else {
        alert("Wrong Password!");
      }
    });
  }

  getData(mode: string) {
      const url = 'http://localhost:80/get_users.php?mode=' + mode;

      // this.http.get(url).subscribe((data: Response) => {
      //   // console.log(data);
      //   toReturn = data;
      // }, error => {
      //   console.log(error);
      // });
      // // console.log(toReturn);
      // return toReturn;

      return new Promise(resolve => {
        this.http.get(url)
          .subscribe((data: any) => {
            resolve(data);
          }, error => {
            // resolve(error);
          });
      });

      // return new Promise(resolve => {
      //   this.http.get(url)
      //     .subscribe((data: any) => {
      //       resolve(data.map(res => {
      //         return new User(
      //           res.last_name,
      //           res.first_name,
      //           res.user_id,
      //           res.password
      //         );
      //       }));
      //     }, error => {
      //       resolve(error);
      //     });
      // });

//       return this.http.get(url).pipe(map(res => {
// // tslint:disable-next-line: no-use-before-declare
//           return new User(
//             res.first_name,
//             res.last_name,
//             res.user_id,
//             res.password
//             );
//         }));
  }
}

// export class User {
//   firstName = '';
//   lastName = '';
//   id = '';
//   password = '';
//     constructor(firstName, lastName, id, password) {
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.id = id;
//         this.password = password;
//     }
// }

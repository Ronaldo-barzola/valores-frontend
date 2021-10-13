import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'APP-MUNICIPALIDAD';

  constructor(private fs: AngularFirestore) {}
  isCollapsed = false;
  ngOninit() {
    this.fs
      .collection('usuario')
      .snapshotChanges()
      .subscribe((personas) => {
        console.log(personas.map((x) => x.payload.doc.data()));
      });
  }
}

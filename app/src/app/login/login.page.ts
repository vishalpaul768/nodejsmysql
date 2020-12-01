import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, LoadingController } from '@ionic/angular';
//import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  validations_form: FormGroup;
  errorMessage: string = '';

  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    //private afAuth: AngularFireAuth,
    public loadingController: LoadingController,
    private http : HttpClient
  ) { }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  validation_messages = {
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  async loginUser(value) {
    this.errorMessage = "";
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        this.loginSaveUser(value)
          .then(res => {
            a.dismiss();
            this.errorMessage = "";
            this.navCtrl.navigateForward('/dashboard/'+res.id);
          }, err => {
            console.log(err);
            a.dismiss();
            this.errorMessage = err.error;
          })
      });
    });
  }

  goToRegisterPage() {
    this.navCtrl.navigateForward('/register');
  }

  loginSaveUser(value) {
    return new Promise<any>((resolve, reject) => {
      /*this.afAuth.signInWithEmailAndPassword(value.email, value.password)
        .then(
          res => resolve(res),
          err => reject(err))*/
      let post = {
        email: value.email,
        password: value.password
      };
      this.http.post("http://127.0.0.1:3000/login", post).subscribe((data:any) => {
        resolve(data);
      }, err => reject(err.error));
    })
  }

}
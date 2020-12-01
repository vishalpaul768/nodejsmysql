import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
//import { AngularFireAuth } from '@angular/fire/auth';
//import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {


  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';

  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ],
    'city': [
      { type: 'required', message: 'City is required.' }
    ],
    'state': [
      { type: 'required', message: 'State is required.' }
    ],
    'country': [
      { type: 'required', message: 'Country is required.' },
    ]
  };

  constructor(
    private navCtrl: NavController,
    public loadingController: LoadingController,
    //private db: AngularFirestore,
    //private afAuth: AngularFireAuth,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
    private http : HttpClient
  ) {
    /*this.http.get("http://127.0.0.1:3000/details/9").subscribe((data:any) => {
      alert(data.id);
      console.log(data);
    });*/
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.minLength(2),
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
      city: new FormControl('', Validators.compose([
        Validators.required
      ])),
      state: new FormControl('', Validators.compose([
        Validators.required
      ])),
      country: new FormControl('', Validators.compose([
        Validators.required
      ])),
    });
  }

  async tryRegister(value) {
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        this.registerUser(value)
        .then(res => {
          a.dismiss();
          this.errorMessage = "";
          //this.successMessage = "Your account has been created. Please log in.";
          this.alertMsg();
        }, err => {
          a.dismiss();
          this.errorMessage = err.message;
          this.successMessage = "";
        })
      });
    });
  }

  async alertMsg() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Success!',
      message: "Your account has been created. Please log in.",
      buttons: [ {
          text: 'Login Now',
          handler: () => {
            this.goLoginPage();
          }
        }
      ]
    });
    await alert.present();
  }

  goLoginPage() {
    this.navCtrl.navigateBack('');
  }

  registerUser(value) {
    return new Promise<any>((resolve, reject) => {
      let post = {
        email: value.email,
        password: value.password,
        name : value.name,
        city : value.city,
        state : value.state,
        country : value.country
      };
      this.http.post("http://127.0.0.1:3000/register", post).subscribe((data:any) => {
        resolve(data);
      }, err => reject(err));
    })
  }


}
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NavController, LoadingController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  userEmail: string;
  userData : any = null;
  Id : string = '';

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
    private route: ActivatedRoute,
    private http : HttpClient,
    public loadingController: LoadingController,
    private formBuilder: FormBuilder,
    public alertController: AlertController,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.Id = params['id'];
        this.userDetails(this.Id).then((res:any) => {
          this.userData = res;
          this.validations_form = this.formBuilder.group({
            name: new FormControl(this.userData.name, Validators.compose([
              Validators.minLength(2),
              Validators.required
            ])),
            email: new FormControl(this.userData.email, Validators.compose([
              Validators.required,
              Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ])),
            password: new FormControl(this.userData.password, Validators.compose([
              Validators.minLength(5),
              Validators.required
            ])),
            city: new FormControl(this.userData.city, Validators.compose([
              Validators.required
            ])),
            state: new FormControl(this.userData.state, Validators.compose([
              Validators.required
            ])),
            country: new FormControl(this.userData.country, Validators.compose([
              Validators.required
            ])),
          });
        }, err => {
          console.log('err', err);
        })
      }
    });
  }

  userDetails(id) {
    return new Promise<any>((resolve, reject) => {
      this.http.get("http://127.0.0.1:3000/details/"+id).subscribe((data:any) => {
        resolve(data);
      }, err => reject(err.error));
    })
  }

  logout() {
    this.navCtrl.navigateBack('');
  }

  async tryUpdate(value) {
    return await this.loadingController.create({
      message: 'Please wait...',
    }).then(a => {
      a.present().then(() => {
        this.updateUser(value)
        .then(res => {
          a.dismiss();
          this.userData = res;
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
      message: "Your account updated successfully.",
      buttons: [ {
          text: 'Ok'
        }
      ]
    });
    await alert.present();
  }

  updateUser(value) {
    return new Promise<any>((resolve, reject) => {
      let post = {
        email: value.email,
        password: value.password,
        name : value.name,
        city : value.city,
        state : value.state,
        country : value.country
      };
      this.http.post("http://127.0.0.1:3000/details/"+this.Id, post).subscribe((data:any) => {
        resolve(data);
      }, err => reject(err));
    })
  }

}
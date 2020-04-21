import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './profile-nav.component.html',
  styleUrls: ['./profile-nav.component.scss']
})
export class ProfileNavComponent implements OnInit {

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  goToEditProfile() {
    this.router.navigate(['edit'], { relativeTo: this.route });
  }

  goToChangePassword() {
    this.router.navigate(['password'], { relativeTo: this.route });
  }
}

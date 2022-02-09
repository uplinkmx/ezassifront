import {Component, OnInit, Input} from '@angular/core';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
  urlEnv = environment.WSURL;
  @Input()
  title: string;
  @Input()
  content: string;
  @Input()
  postedby: string;
  @Input()
  assigness: string;
  @Input()
  workflow: string;
  @Input()
  reviewscore: string;
  @Input()
  createdAt: string;
  @Input()
  image: string;

  selectedRating = 0;
  stars = [
    {
      id: 1,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 2,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 3,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 4,
      icon: 'star',
      class: 'star-gray star-hover star'
    },
    {
      id: 5,
      icon: 'star',
      class: 'star-gray star-hover star'
    }

  ];

  constructor() {
  }

  selectStar(value) {
    console.log(value);
    this.stars.filter((star) => {
      console.log(star);
      if (star.id <= value) {
        star.class = 'star-gold star';
      } else {
        star.class = 'star-gray star';
      }
      return star;
    });
    this.selectedRating = value;
  }

  ngOnInit() {
  }

}

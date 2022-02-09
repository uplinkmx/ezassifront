import {Component, OnInit, ViewChild} from '@angular/core';
import {HttpService} from '../../services/http.service';
import {HttpModule, Http, Response} from '@angular/http';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  urlEnv = environment.WSURL;
  posts: any = [];
  isloading = true;
  array = [];
  sum = 5;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  direction = '';
  offset = 1;
  count = 0;
  start = 0;
  limit = 5;

  constructor(private http: Http) {
  }

  ngOnInit() {
    this.obtainPosts();
  }

  /** obtain post from the backend limit 5  */
  obtainPosts() {
    const data: any = {offset: this.offset};
    this.http.post(this.urlEnv + 'api/posts/all', data)
      .map(this.extractData)
      .subscribe(post => {
        this.posts = post.rows;
        this.count = post.count;
        this.addItems(this.start, this.sum);
        this.isloading = false;
      });
  }

  /** extract data from response */
  private extractData(res: Response) {
    const body = res.json();
    return body || [];
  }

  /** add items to infine scroller */
  addItems(index, sum) {
    for (let i = 0; i < this.limit; ++i) {
      /** if the post is true then add to array */
      if (this.posts[i]) {
        this.array.push(this.posts[i]);
      }
    }
  }

  /** activate this function on scroll down */
  onScrollDown() {
    console.log('scrolled down!!');
    this.start = this.sum;
    this.sum += 5;
    const all = this.offset * this.limit;
    this.offset++;
    if (all < this.count) {
      this.obtainPosts();
    }
    this.direction = 'down';
  }
}

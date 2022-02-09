import {Component, OnDestroy, OnInit, ViewChild, ElementRef} from '@angular/core';
import {Subject} from 'rxjs';
import {DataTablesModule, DataTableDirective} from 'angular-datatables';
import {HttpModule, Http, Response} from '@angular/http';
import 'rxjs/add/operator/map';
import {Post} from '../../interfaces/post';
import {ModalComponent} from '../modal/modal.component';
import {FormGroup, FormControl, Validators} from '@angular/forms';
import {environment} from '../../../environments/environment';

import {NgbModal, ModalDismissReasons, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import Swal from 'sweetalert2';


@Component({
  selector: 'app-postslist',
  templateUrl: './postslist.component.html',
  styleUrls: ['./postslist.component.css']
})
export class PostslistComponent implements OnInit {
  @ViewChild('modallargo') private modallargo: ModalComponent;
  @ViewChild('imagefile') imagefile: ElementRef;
  modalRef: any;
  urlEnv = environment.WSURL;
  closeResult = '';
  post: Post = {
    title: '',
    content: '',
    image: '',
    postedby: '',
    assigness: '',
    workflow: '',
    reviewscore: '',
  };
  postid: any = '';

  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();
  persons: any = [];

  constructor(private http: Http, private modalService: NgbModal) {
  }

  posts: any = [];
  textmodal = 'Add Post';
  textbutton = 'save Post';
  httpfunction = 'save';

  ngOnInit() {
    this.dtInit();
    this.obtainPosts();
  }

  obtainPosts() {
    this.http.get(this.urlEnv + 'api/posts/all')
      .map(this.extractData)
      .subscribe(post => {
        this.posts = post;
        this.dtTrigger.next();
        this.dtElement.dtInstance.then(
          (dtInstance: DataTables.Api) => {
            dtInstance.columns().every(function () {
              const that = this;
              $('input', this.footer()).on('keyup change', function () {
                if (that.search() !== this['value']) {
                  that
                    .search(this['value'])
                    .draw();
                }
              });
            });
          }
        );
      });
  }

  reloadPosts() {
    this.http.get(this.urlEnv + 'api/posts/all')
      .map(this.extractData)
      .subscribe(post => {
        this.posts = post;
      });
  }

  private extractData(res: Response) {
    const body = res.json();
    return body || [];
  }

  private dtInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: {
        emptyTable: '',
        zeroRecords: 'No hay coincidencias',
        lengthMenu: 'show _MENU_ elements',
        search: 'Search:',
        info: 'from _START_ to _END_ of _TOTAL_ elements',
        infoEmpty: ' 0 to 0 od 0 elements',
        infoFiltered: '(filtered of _MAX_ elements)',
        paginate: {
          first: 'first.',
          last: 'last.',
          next: 'next.',
          previous: 'prev.'
        },
      },
      dom: 'Bfrtip',
      buttons: [
        'excel', 'print'
      ],
      responsive: true
    }; // 'copy', 'csv', 'excel', 'print'
  }

  async openModal(): Promise<any> {
    return await this.modallargo.openlg({size: 'lg', animation: true});
  }

  open(content) {
    this.modalRef = this.modalService.open(content, {size: 'lg'});
    this.modalRef.result.then((data) => {
      // on close
    }, (reason) => {
      // on dismiss
    });

  }

  close() {
    this.modalRef.close();
    this.resetPost();
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  sendPost(): void {
    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('postedby', this.post.postedby);
    formData.append('assigness', this.post.assigness);
    formData.append('workflow', this.post.workflow);
    formData.append('reviewscore', this.post.reviewscore);
    formData.append('image', this.post.image);
    if (this.httpfunction === 'save') {
      this.http.post(this.urlEnv + 'api/posts/save', formData).map(this.extractData)
        .subscribe(post => {
          if (post.status) {
            this.resetPost();
            this.reloadPosts();
            this.modalRef.close();
            Swal.fire('the post has been saved in the node js back', '', 'success');
          }
        });
    } else {
      formData.append('id', this.postid);
      this.http.post(this.urlEnv + 'api/posts/edit', formData).map(this.extractData)
        .subscribe(post => {
          if (post.status) {
            this.resetPost();
            this.reloadPosts();
            this.modalRef.close();
            Swal.fire('the post has been saved in the node js back', '', 'success');
          }
        });
    }
  }

  addfile(ev): void {
    const file: any = ev.target;
    if (file.files.length > 0) {
      this.post.image = file.files[0];
    }
  }


  deactivate(post) {
    const data = {id: post.id};
    this.http.post(this.urlEnv + 'api/posts/deactivate', data).map(this.extractData)
      .subscribe(res => {
        if (res.status) {
          this.reloadPosts();
          Swal.fire('the post has been deactivaded', '', 'success');
          console.log(res);
        } else {
          Swal.fire('an error has been ocurred please try again', '', 'error');
        }
      });
  }


  activate(post) {
    const data = {id: post.id};
    this.http.post(this.urlEnv + 'api/posts/activate', data).map(this.extractData)
      .subscribe(res => {
        if (res.status) {
          this.reloadPosts();
          Swal.fire('the post has been reactivaded', '', 'success');
          console.log(res);
        } else {
          Swal.fire('an error has been ocurred please try again', '', 'error');
        }
      });
  }

  delete(post) {
    const data = {id: post.id};
    this.http.post(this.urlEnv + 'api/posts/delete', data).map(this.extractData)
      .subscribe(res => {
        if (res.status) {
          this.reloadPosts();
          Swal.fire('the post has been deleted from the database', '', 'success');
          console.log(res);
        } else {
          Swal.fire('an error has been ocurred please try again', '', 'error');
        }
      });
  }

  edit(selectedpost, content) {
    this.postid = selectedpost.id;
    this.post.title = selectedpost.title;
    this.post.content = selectedpost.content;
    this.post.postedby = selectedpost.postedby;
    this.post.assigness = selectedpost.assigness;
    this.post.workflow = selectedpost.workflow;
    this.post.reviewscore = selectedpost.reviewscore;
    this.textmodal = 'Edit Post';
    this.textbutton = 'Edit Post';
    this.httpfunction = 'edit';
    document.getElementById('buttonModal').click();
  }

  resetPost() {
    this.postid = '';
    this.post.title = '';
    this.post.content = '';
    this.post.image = '';
    this.post.postedby = '';
    this.post.assigness = '';
    this.post.workflow = '';
    this.post.reviewscore = '';
    this.textmodal = 'Add Post';
    this.textbutton = 'save Post';
    this.httpfunction = 'save';
  }

}

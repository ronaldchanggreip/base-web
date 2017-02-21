import {Component,Inject,forwardRef} from '@angular/core';
import {AppComponent} from './app.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="footer">
            <div class="card clearfix" id="divFooter" style="visibility: hidden">
             <span class="footer-text-left"><strong>Copyright</strong> Greip Company &copy; 2017</span>
             <span class="footer-text-right"><span class="ui-icon ui-icon-copyright"></span>  <span>All Rights Reserved</span></span>
            </div>
        </div>
    `
})
export class AppFooter {

}
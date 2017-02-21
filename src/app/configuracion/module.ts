import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule, ReactiveFormsModule}   from '@angular/forms';
import {GeGrupoParametroListComponent} from './GeGrupoParametro/list.component';
import {GeGrupoParametroFormComponent} from './GeGrupoParametro/form.component';
import {GeParametroListComponent} from './GeParametro/list.component';
import {GeParametroFormComponent} from './GeParametro/form.component';
import {GeInventoFormComponent} from './GeInventos/form.component';
import {GeMonedaListComponent} from './GeMoneda/list.component';
import {GeMonedaFormComponent} from './GeMoneda/form.component';
import {GeSocioNegocioFormComponent} from './GeSocioNegocio/form.component';
import {GeSocioNegocioListComponent} from './GeSocioNegocio/list.component';
import {GeSocioNegocioCuentaFormComponent} from './GeSocioNegocioCuenta/form.component';
import {GeSocioNegocioCuentaListComponent} from './GeSocioNegocioCuenta/list.component';
import {GeBitacoraListComponent} from './GeBitacora/bitacora.component'
import {GeArchivoListComponent} from './GeArchivo/archivo.component'


import {CommonModule}   from '@angular/common';
import {GeGenericModule} from '../generic/module';

import {AccordionModule} from 'primeng/primeng';
import {AutoCompleteModule} from 'primeng/primeng';
import {BreadcrumbModule} from 'primeng/primeng';
import {ButtonModule} from 'primeng/primeng';
import {CalendarModule} from 'primeng/primeng';
import {CarouselModule} from 'primeng/primeng';
import {ChartModule} from 'primeng/primeng';
import {CheckboxModule} from 'primeng/primeng';
import {ChipsModule} from 'primeng/primeng';
import {CodeHighlighterModule} from 'primeng/primeng';
import {ConfirmDialogModule} from 'primeng/primeng';
import {SharedModule} from 'primeng/primeng';
import {ContextMenuModule} from 'primeng/primeng';
import {DataGridModule} from 'primeng/primeng';
import {DataListModule} from 'primeng/primeng';
import {DataScrollerModule} from 'primeng/primeng';
import {DataTableModule} from 'primeng/primeng';
import {DialogModule} from 'primeng/primeng';
import {DragDropModule} from 'primeng/primeng';
import {DropdownModule} from 'primeng/primeng';
import {EditorModule} from 'primeng/primeng';
import {FieldsetModule} from 'primeng/primeng';
import {FileUploadModule} from 'primeng/primeng';
import {GalleriaModule} from 'primeng/primeng';
import {GMapModule} from 'primeng/primeng';
import {GrowlModule} from 'primeng/primeng';
import {InputMaskModule} from 'primeng/primeng';
import {InputSwitchModule} from 'primeng/primeng';
import {InputTextModule} from 'primeng/primeng';
import {InputTextareaModule} from 'primeng/primeng';
import {LightboxModule} from 'primeng/primeng';
import {ListboxModule} from 'primeng/primeng';
import {MegaMenuModule} from 'primeng/primeng';
import {MenuModule} from 'primeng/primeng';
import {MenubarModule} from 'primeng/primeng';
import {MessagesModule} from 'primeng/primeng';
import {MultiSelectModule} from 'primeng/primeng';
import {OrderListModule} from 'primeng/primeng';
import {OverlayPanelModule} from 'primeng/primeng';
import {PaginatorModule} from 'primeng/primeng';
import {PanelModule} from 'primeng/primeng';
import {PanelMenuModule} from 'primeng/primeng';
import {PasswordModule} from 'primeng/primeng';
import {PickListModule} from 'primeng/primeng';
import {ProgressBarModule} from 'primeng/primeng';
import {RadioButtonModule} from 'primeng/primeng';
import {RatingModule} from 'primeng/primeng';
import {ScheduleModule} from 'primeng/primeng';
import {SelectButtonModule} from 'primeng/primeng';
import {SlideMenuModule} from 'primeng/primeng';
import {SliderModule} from 'primeng/primeng';
import {SpinnerModule} from 'primeng/primeng';
import {SplitButtonModule} from 'primeng/primeng';
import {StepsModule} from 'primeng/primeng';
import {TabMenuModule} from 'primeng/primeng';
import {TabViewModule} from 'primeng/primeng';
import {TerminalModule} from 'primeng/primeng';
import {TieredMenuModule} from 'primeng/primeng';
import {ToggleButtonModule} from 'primeng/primeng';
import {ToolbarModule} from 'primeng/primeng';
import {TooltipModule} from 'primeng/primeng';
import {TreeModule} from 'primeng/primeng';
import {TreeTableModule} from 'primeng/primeng';
import {InplaceModule} from 'primeng/primeng';
import { SafeUrlPipe } from '../generic/pipes/safe-url.pipe';
import {GeSocioNegocioIncludeFormComponent} from "./GeSocioNegocio/includeForm.component";


@NgModule({
        declarations: [
                GeGrupoParametroListComponent,
                GeGrupoParametroFormComponent,
                GeParametroListComponent,
                GeParametroFormComponent,
                GeInventoFormComponent,
                GeMonedaListComponent,
                GeMonedaFormComponent,
                GeSocioNegocioFormComponent,
                GeSocioNegocioListComponent,
                GeSocioNegocioCuentaFormComponent,
                GeSocioNegocioCuentaListComponent,
                GeBitacoraListComponent,
                GeArchivoListComponent,
                GeSocioNegocioIncludeFormComponent,
                SafeUrlPipe
        ],        
        imports: [BrowserModule, FormsModule, ReactiveFormsModule,
                CommonModule,
                GeGenericModule,
                AccordionModule,
                AutoCompleteModule,
                BreadcrumbModule,
                ButtonModule,
                CalendarModule,
                CarouselModule,
                ChartModule,
                CheckboxModule,
                ChipsModule,
                CodeHighlighterModule,
                ConfirmDialogModule,
                SharedModule,
                ContextMenuModule,
                DataGridModule,
                DataListModule,
                DataScrollerModule,
                DataTableModule,
                DialogModule,
                DragDropModule,
                DropdownModule,
                EditorModule,
                FieldsetModule,
                FileUploadModule,
                GalleriaModule,
                GMapModule,
                GrowlModule,
                InputMaskModule,
                InputSwitchModule,
                InputTextModule,
                InputTextareaModule,
                LightboxModule,
                ListboxModule,
                MegaMenuModule,
                MenuModule,
                MenubarModule,
                MessagesModule,
                MultiSelectModule,
                OrderListModule,
                OverlayPanelModule,
                PaginatorModule,
                PanelModule,
                PanelMenuModule,
                PasswordModule,
                PickListModule,
                ProgressBarModule,
                RadioButtonModule,
                RatingModule,
                ScheduleModule,
                SelectButtonModule,
                SlideMenuModule,
                SliderModule,
                SpinnerModule,
                SplitButtonModule,
                StepsModule,
                TabMenuModule,
                TabViewModule,
                TerminalModule,
                TieredMenuModule,
                ToggleButtonModule,
                ToolbarModule,
                TooltipModule,
                TreeModule,
                TreeTableModule,
                InplaceModule
        ],
        exports: [GeBitacoraListComponent, GeArchivoListComponent, GeSocioNegocioIncludeFormComponent]

})

export class GeConfiguracionModule {


}
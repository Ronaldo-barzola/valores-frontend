import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { ApiService } from '@app/services/api.service';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
} from 'ng-zorro-antd/table';

interface Setting {
  bordered: boolean;
  loading: boolean;
  pagination: boolean;
  sizeChanger: boolean;
  title: boolean;
  header: boolean;
  footer: boolean;
  expandable: boolean;
  checkbox: boolean;
  fixHeader: boolean;
  noResult: boolean;
  ellipsis: boolean;
  simple: boolean;
  size: NzTableSize;
  tableScroll: string;
  tableLayout: NzTableLayout;
  position: NzTablePaginationPosition;
  paginationType: NzTablePaginationType;
}

@Component({
  selector: 'app-lote',
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.scss'],
})
export class LoteComponent implements OnInit {
  validateForm!: FormGroup;
  size: NzButtonSize = 'small';
  fecIni: any = null;
  fecFin: any = null;
  tipoContrib: string = '';
  tipoValor: string = '';
  codContrib: string = '';
  nomContrib: string = '';
  disabled: boolean = true;
  actualDetalleProcesoId: string = '';
  sector: string = '';
  tipdfd: string = '';

  dataLote: any = [];
  dataTipoValor: any = [];
  dataTipoContribuyente: any;

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  traduceTipVal(tipval: string) {
    if (tipval == '1') {
      return 'Impuesto Predial';
    } else {
      return 'Arbitrios';
    }
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  settingForm?: FormGroup;
  settingValue!: Setting;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.settingForm = this.fb.group({
      bordered: false,
      loading: false,
      pagination: true,
      sizeChanger: false,
      title: true,
      header: true,
      footer: true,
      expandable: true,
      checkbox: true,
      fixHeader: false,
      noResult: false,
      ellipsis: false,
      simple: false,
      size: 'small',
      paginationType: 'default',
      tableScroll: 'unset',
      tableLayout: 'auto',
      position: 'bottom',
    });

    this.settingValue = this.settingForm.value;

    this.loadDataProceso();
    this.fillTipoValor();
    this.fillTipoContribuyente();

    this.validateForm = this.fb.group({
      fecha: [null, [Validators.required]],
      tipoContri: [null, [Validators.required]],
      tipoValor: [null, [Validators.required]],
      sector: [null, [Validators.required]],
      tipdfd: [null, [Validators.required]],
    });
  }

  fillTipoValor() {
    const data_post = {
      p_tipval: 0,
    };

    this.api.getDataTipoValor(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoValor = data;
    });
  }

  fillTipoContribuyente() {
    const data_post = {
      p_tipcon: 0,
    };

    this.api.getDataTipoContribuyente(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoContribuyente = data;
    });
  }

  loadDataProceso() {
    const data_post = {
      p_fecini: this.fecIni,
      p_fecfin: this.fecFin,
      p_tipval: this.tipoValor,
      p_tipdfd: this.tipoValor,
      p_sector: this.tipoContrib,
    };

    this.api.getDataLoteListar(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataLote = data;
    });
  }

  changeActualDetalleProceso(actualDetalle: string) {
    let all_rows = document.querySelectorAll('.proceso_selectable_row');
    let element_row = document.getElementById('row_data_proceso_' + actualDetalle) as HTMLTableRowElement;
    let btn_detalle_proceso = document.getElementById('btn_detalle_proceso') as HTMLButtonElement;
    console.log('Rows:', all_rows);

    this.actualDetalleProcesoId = actualDetalle;

    all_rows.forEach((element) => {
      element.classList.remove('proceso_selected');
    });

    element_row.classList.add('proceso_selected');
    btn_detalle_proceso.removeAttribute('disabled');
  }

  detalleProceso() {
    this.router.navigate(['/lote-listado-contrib', this.actualDetalleProcesoId]);
  }
}

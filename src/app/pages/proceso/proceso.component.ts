import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import * as XLSX from 'xlsx';
import {
  NzTableLayout,
  NzTablePaginationPosition,
  NzTablePaginationType,
  NzTableSize,
} from 'ng-zorro-antd/table';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

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
  selector: 'app-proceso',
  templateUrl: './proceso.component.html',
  styleUrls: ['./proceso.component.scss'],
})
export class ProcesoComponent implements OnInit {
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

  dataProceso: any = [];
  dataTipoValor: any = [];
  dataTipoContribuyente: any;

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];

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
  ) { }

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
    // this.exportarExcel();

    this.validateForm = this.fb.group({
      fecha: [null, [Validators.required]],
      tipoContri: [null, [Validators.required]],
      tipoValor: [null, [Validators.required]],
      sector: [null, [Validators.required]],
      tipdfd: [null, [Validators.required]],
    });
  }

  exportarExcel() {
    let element = document.getElementById('tableProceso');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'proceso_deuda.xlsx');

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

    this.api.getDataProceso(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataProceso = data;
      // listOfDisplayData = [...this.listOfData];
    });
  }

  changeActualDetalleProceso(actualDetalle: string) {
    let all_rows = document.querySelectorAll('.proceso_selectable_row');
    let element_row = document.getElementById(
      'row_data_proceso_' + actualDetalle
    ) as HTMLTableRowElement;
    let btn_detalle_proceso = document.getElementById(
      'btn_detalle_proceso'
    ) as HTMLButtonElement;

    this.actualDetalleProcesoId = actualDetalle;
    all_rows.forEach((element) => {
      element.classList.remove('proceso_selected');
    });

    element_row.classList.add('proceso_selected');
    btn_detalle_proceso.removeAttribute('disabled');
  }

  detalleProceso() {
    this.router.navigate(['/listado-contrib', this.actualDetalleProcesoId]);
  }
}

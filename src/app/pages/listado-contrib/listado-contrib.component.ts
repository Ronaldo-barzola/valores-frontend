import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzTableLayout, NzTablePaginationPosition, NzTablePaginationType, NzTableSize } from 'ng-zorro-antd/table';
import * as XLSX from 'xlsx';

interface ItemData {
  id: number;
  codigo: string;
  nombre: number;
  monto: string;
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
  selector: 'app-listado-contrib',
  templateUrl: './listado-contrib.component.html',
  styleUrls: ['./listado-contrib.component.scss'],
})
export class ListadoContribComponent implements OnInit {
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      },
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 !== 0)
        );
        this.refreshCheckedStatus();
      },
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) =>
          this.updateCheckedSet(data.id, index % 2 === 0)
        );
        this.refreshCheckedStatus();
      },
    },
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();

  paramNumProceso: any;
  dataProceso: any;
  dataListado: any;
  dataListadoFilter: any = [];
  dataListadoFilter2: any = [];
  dataListadoAcumulado: any = [];
  dataListadoAcumuladoFinal: any = [];
  litNumProceso: string = '';
  litTituloA: string = '';
  litTituloB: string = '';
  actualDetalleProcconId: string = '';

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach((item) =>
      this.updateCheckedSet(item.id, value)
    );
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every((item) =>
      this.setOfCheckedId.has(item.id)
    );
    this.indeterminate =
      this.listOfCurrentPageData.some((item) =>
        this.setOfCheckedId.has(item.id)
      ) && !this.checked;
  }

  size: NzButtonSize = 'small';
  date = null;
  settingForm?: FormGroup;
  settingValue!: Setting;

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  constructor(
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
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
      position: 'bottom'
    });

    this.settingValue = this.settingForm.value;

    this.paramNumProceso = this.route.snapshot.params.numpro;

    this.loadDataProceso();
    this.loadDetalleProceso();
  }

  exportarExcel() {
    let element = document.getElementById('tableDetalleProceso');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, 'proceso_detalle.xlsx');

  }

  loadDataProceso() {
    const data_post = {
      p_pdlnid: this.paramNumProceso,
    };

    this.api.getDataProcesoDetalle(data_post).subscribe((data: any) => {
      console.log(data);

      this.litNumProceso = this.paramNumProceso.padStart(4, '0');
      this.litTituloA = data[0].pdl_destri.toUpperCase();
    });
  }

  loadDetalleProceso() {
    const data_post = {
      p_pdlnid: this.paramNumProceso,
    };

    this.api.getDataDeudaContri(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataListado = data;
    });
  }

  regresarProcesos() {
    this.router.navigate(['/proceso']);
  }

  changeActualDetalleProcCon(actualDetalle: string) {
    let all_rows = document.querySelectorAll('.proccon_selectable_row');
    let element_row = document.getElementById(
      'row_data_proccon_' + actualDetalle
    ) as HTMLTableRowElement;
    let btn_detalle_proccon = document.getElementById(
      'btn_detalle_proccon'
    ) as HTMLButtonElement;

    this.actualDetalleProcconId = actualDetalle;
    all_rows.forEach((element) => {
      element.classList.remove('proccon_selected');
    });

    element_row.classList.add('proccon_selected');
    btn_detalle_proccon.removeAttribute('disabled');
  }

  detalleProccon() {
    this.router.navigate([
      '/deuda-contrib',
      this.paramNumProceso,
      this.actualDetalleProcconId,
    ]);
  }

  sortFn = (a: ItemData, b: ItemData) => a.codigo.localeCompare(b.codigo);
}

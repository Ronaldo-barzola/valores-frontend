import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';

interface ItemData {
  id: number;
  codigo: string;
  nombre: number;
  monto: string;
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

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  constructor(private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(){
    this.paramNumProceso = this.route.snapshot.params.numpro;

    this.loadDataProceso();
    this.loadDetalleProceso();
  }

  loadDataProceso(){
    const data_post = {
      p_pdlnid: this.paramNumProceso
    };

    this.api.getDataProcesoDetalle(data_post).subscribe((data: any) => {
      console.log(data);
      
      this.litNumProceso = this.paramNumProceso.padStart(4, '0');
      this.litTituloA = (data[0].pdl_destri).toUpperCase();
    });
  }

  loadDetalleProceso(){
    const data_post = {
      p_pdlnid: this.paramNumProceso
    };

    this.api.getDataDeudaContri(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataListado = data;
    });
  }

  regresarProcesos(){
    this.router.navigate(['/proceso']);
  }

  changeActualDetalleProcCon(actualDetalle: string){
    let all_rows = document.querySelectorAll('.proccon_selectable_row');
    let element_row = document.getElementById('row_data_proccon_' + actualDetalle) as HTMLTableRowElement;
    let btn_detalle_proccon = document.getElementById('btn_detalle_proccon') as HTMLButtonElement;
    
    this.actualDetalleProcconId = actualDetalle;
    all_rows.forEach(element => {
      element.classList.remove("proccon_selected");
    });

    element_row.classList.add("proccon_selected");
    btn_detalle_proccon.removeAttribute('disabled');
  }

  detalleProccon(){
    this.router.navigate(['/deuda-contrib', this.paramNumProceso, this.actualDetalleProcconId]);
  }

  sortFn = (a: ItemData, b: ItemData) => a.codigo.localeCompare(b.codigo);
}

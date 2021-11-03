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

  ngOnInit(): void {
    this.paramNumProceso = this.route.snapshot.params.numpro;

    this.loadDataProceso();
    this.loadDetalleProceso();
  }

  loadDataProceso(){
    const data_post = {};

    this.api.getDataProceso(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataProceso = data;

      this.dataProceso.forEach((element: any) => {
        if(element.numpro == this.paramNumProceso){
          this.litNumProceso = this.paramNumProceso.padStart(4, '0');
          this.litTituloA = (element.tipcon).toUpperCase();
          this.litTituloB = (element.tipval).toUpperCase();
        }
      });
    });
  }

  loadDetalleProceso(){
    const data_post = {};

    this.api.getDataListado(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataListado = data;

      this.dataListado.forEach((element: any) => {
        if(element.nompro == this.paramNumProceso){
          this.dataListadoFilter.push(element);
          this.dataListadoFilter2.push(element);
        }
      });

      this.dataListadoFilter.forEach((element: any) => {
        let acumuladoMoncin = 0;

        this.dataListadoFilter2.forEach((element2: any) => {
          if(element.codcon == element2.codcon){
            acumuladoMoncin = (acumuladoMoncin + parseFloat(element2.moncin));
          }
        });

        this.dataListadoAcumulado.push({
          codcon: element.codcon,
          razsoc: element.razsoc,
          monsum: acumuladoMoncin
        });
      });

      const removeDupliactes = (values: any) => {
        let concatArray = values.map((eachValue: any) => {
          return Object.values(eachValue).join('')
        })
        let filterValues = values.filter((value: any, index: any) => {
          return concatArray.indexOf(concatArray[index]) === index
      
        })
        return filterValues
      }
      
      this.dataListadoAcumuladoFinal = removeDupliactes(this.dataListadoAcumulado);

      console.log(this.dataListadoFilter);
      console.log(this.dataListadoAcumulado);
      console.log(this.dataListadoAcumuladoFinal);
    });
  }

  sortFn = (a: ItemData, b: ItemData) => a.codigo.localeCompare(b.codigo);
}

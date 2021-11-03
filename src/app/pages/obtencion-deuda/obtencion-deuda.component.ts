import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';

interface ItemData {
  id: number;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-obtencion-deuda',
  templateUrl: './obtencion-deuda.component.html',
  styleUrls: ['./obtencion-deuda.component.scss'],
})
export class ObtencionDeudaComponent implements OnInit {

  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: readonly ItemData[] = [];
  listOfData: readonly ItemData[] = [];
  setOfCheckedId = new Set<number>();

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
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: readonly ItemData[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  validateForm!: FormGroup;
  size: NzButtonSize = 'small';
  date = null;

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (this.validateForm.controls.hasOwnProperty(i)) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
  }

  dataListado: any;
  dataListadoFilter: any = [];
  dataListadoFilter2: any = [];
  dataListadoAcumulado: any = [];
  dataListadoAcumuladoFinal: any = [];

  filterTipoContrib: string = '';
  filterTipoValor: string = '';
  filterAnioDesde: string = '';
  filterAnioHasta: string = '';
  filterMontoDesde: string = '';
  filterMontoHasta: string = '';

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {


    this.validateForm = this.fb.group({
      tipoContri: [null, [Validators.required]],
      tipoValor: [null, [Validators.required]],
      anioDesde: [null, [Validators.required]],
      anioHasta: [null, [Validators.required]],
      montoDesde: [null, [Validators.required]],
      montoHasta: [null, [Validators.required]],
      
    });
  }

  filtraInformacion(){
    
    let btnProcesarDOM = document.getElementById('btnProcesar') as HTMLButtonElement;
    btnProcesarDOM.setAttribute('disabled', 'disabled');
    btnProcesarDOM.innerHTML = '<i class="fa fa-spinner fa-pulse"></i> Cargando...';

    setTimeout(() => {
      this.dataListado = [];
      this.dataListadoFilter = [];
      this.dataListadoFilter2 = [];
      this.dataListadoAcumulado = [];
      this.dataListadoAcumuladoFinal = [];

      const data_post = {};

      this.api.getDataListado(data_post).subscribe((data: any) => {
        console.log(data);
        this.dataListado = data;

        this.dataListado.forEach((element: any) => {
          if(element.nompro == this.filterTipoValor && element.anoges >= parseInt(this.filterAnioDesde) && element.anoges <= parseInt(this.filterAnioHasta)){
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

          if(acumuladoMoncin >= parseFloat(this.filterMontoDesde) && acumuladoMoncin <= parseFloat(this.filterMontoHasta)){
            this.dataListadoAcumulado.push({
              codcon: element.codcon,
              razsoc: element.razsoc,
              monsum: acumuladoMoncin
            });
          }
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
      });

      btnProcesarDOM.innerHTML = 'Procesar';
      btnProcesarDOM.removeAttribute('disabled');
    }, 4500);
  }
}

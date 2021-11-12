import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
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
  
  dataProceso: any = [];
  dataTipoValor: any = [];
  

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }
  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  traduceTipVal(tipval: string){
    if(tipval == '1'){
      return 'Impuesto Predial';
    }else{
      return 'Arbitrios'
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

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {}

  ngOnInit(){

    this.loadDataProceso();
    this.fillTipoValor();

    this.validateForm = this.fb.group({
      fecha: [null, [Validators.required]],
      tipoContri: [null, [Validators.required]],
      tipoValor: [null, [Validators.required]],
      codigoContri: [null, [Validators.required]],
      nombreContri: [null, [Validators.required]],
    });
  }

  fillTipoValor(){
    const data_post = {
      p_tipval: 1
    };

    this.api.getDataTipoValor(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoValor = data;
    });
  }

  loadDataProceso(){
    const data_post = {
      p_fecini: this.fecIni,
      p_fecfin: this.fecFin,
      p_tipcon: this.tipoContrib,
      p_tvalor: this.tipoValor,
      p_codcon: this.codContrib,
      p_nomcon: this.nomContrib,
    };

    this.api.getDataProceso(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataProceso = data;
    });
  }

  changeActualDetalleProceso(actualDetalle: string){
    this.actualDetalleProcesoId = actualDetalle;
  }

  detalleProceso(){
    this.router.navigate(['/listado-contrib', this.actualDetalleProcesoId]);
  }
}

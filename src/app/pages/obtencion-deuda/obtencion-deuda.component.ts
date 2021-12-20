import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '@app/services/api.service';
import { NzButtonSize } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';

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

  paramNumProceso: any;
  dataTipoUbicacion: any;
  dataTipoContribuyente: any;
  dataTipoValor: any;
  dataListado: any = [];

  filterTipoContrib: string = '';
  filterTipoValor: string = '';
  filterAnioDesde: string = '';
  filterAnioHasta: string = '';
  filterMontoDesde: string = '';
  filterMontoHasta: string = '';
  filterSector: string = '';
  filterUbicacion: string = '';
  filterPerIni: string = '1';
  filterPerFin: string = '3';

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private route: ActivatedRoute,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.fillTipoUbicacion();
    this.fillTipoContribuyente();
    this.fillTipoValor();
    this.validateForm = this.fb.group({
      tipoContri: [null, [Validators.required]],
      tipoValor: [null, [Validators.required]],
      anioDesde: [null, [Validators.required]],
      anioHasta: [null, [Validators.required]],
      montoDesde: [null, [Validators.required]],
      montoHasta: [null, [Validators.required]],
      tipoSector: [null, [Validators.required]],
      ubicacion: [null, [Validators.required]],
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

  fillTipoUbicacion() {
    const data_post = {
      p_ubidfd: 0,
    };

    this.api.getDataTipoUbicacion(data_post).subscribe((data: any) => {
      console.log(data);
      this.dataTipoUbicacion = data;
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

  filtraInformacion() {
    // let btnSend = document.getElementById('btnSendAyuda') as HTMLButtonElement;

    // btnSend.disabled = true;
    // btnSend.innerHTML = '<i class="fa fa-spinner fa-pulse fa-fw"></i> Enviando...';

    // const formData = new FormData();
    // formData.append('p_anoini', this.filterAnioDesde);
    // formData.append('p_anofin', this.filterAnioHasta);
    // formData.append('p_perini', this.filterPerIni);
    // formData.append('p_perfin', this.filterPerFin);
    // formData.append('p_tipcon', this.filterTipoContrib);
    // formData.append('p_tipval', this.filterTipoValor);
    // formData.append('p_disdfu', this.filterUbicacion);
    // formData.append('p_sector', this.filterSector);
    // formData.append('p_monini', this.filterMontoDesde);
    // formData.append('p_monfin', this.filterMontoHasta);

    // console.log('p_anoini', this.filterAnioDesde);
    // console.log('p_anofin', this.filterAnioHasta);
    // console.log('p_perini', this.filterPerIni);
    // console.log('p_perfin', this.filterPerFin);
    // console.log('p_tipcon', this.filterTipoContrib);
    // console.log('p_tipval', this.filterTipoValor);
    // console.log('p_disdfu', this.filterUbicacion);
    // console.log('p_sector', this.filterSector);
    // console.log('p_monini', this.filterMontoDesde);
    // console.log('p_monfin', this.filterMontoHasta);

    const data_post = {
      p_anoini: this.filterAnioDesde,
      p_anofin: this.filterAnioHasta,
      p_perini: this.filterPerIni,
      p_perfin: this.filterPerFin,
      p_tipcon: this.filterTipoContrib,
      p_tipval: this.filterTipoValor,
      p_disdfu: this.filterUbicacion,
      p_sector: this.filterSector,
      p_monini: this.filterMontoDesde,
      p_monfin: this.filterMontoHasta
    }

    console.log('==================================');
    console.log('Enviado:', data_post);
    
    this.api.postDataProceso(data_post).subscribe((data: any) => {
      console.log(data);
    });

    this.message.create('success', `Nuevo proceso generado correctamente.`);

    // this.router.navigate(['/proceso']);
  }

  regresarProcesos() {
    this.router.navigate(['/listado-contrib', this.paramNumProceso]);
  }
}
